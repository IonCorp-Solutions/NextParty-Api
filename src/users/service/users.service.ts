import { CreateEventDto } from '@events/dto/create-event.dto';
import { Event } from '@events/entities/event.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { Express } from 'express';
import { compare, hash } from 'bcrypt';
import { UserEvent } from '@user_event/entities/user_event.entity';
import { Image } from '@images/entities/image.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Event) private eventRepo: Repository<Event>,
    @InjectRepository(UserEvent) private userEventRepo: Repository<UserEvent>,
    @InjectRepository(Image) private imageRepo: Repository<Image>,
  ) {}

  async getByEmail(email: string) {
    const user = await this.userRepo.findOneBy({ email: email });
    if (!user) {
      throw new BadRequestException(`User with email '${email}' not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.userRepo.findOneBy({
      email: createUserDto.email,
    });
    if (userExists) {
      throw new BadRequestException(
        `A user with the email '${createUserDto.email}' already exists`,
      );
    }
    try {
      const hashedPassword = await hash(createUserDto.password, 10);

      const newUser = this.userRepo.create({
        ...createUserDto,
        password: hashedPassword,
        events: [],
      });

      await this.userRepo.save(newUser);
    } catch (error) {
      throw new BadRequestException(`Error creating user: ${error.message}`);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOneBy({ id: id });
    if (!user) {
      throw new BadRequestException(`User with ID ${id} not found`);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepo.findOneBy({
        email: updateUserDto.email,
      });
      if (existingUser && existingUser.id !== user.id) {
        throw new BadRequestException(
          `Email ${updateUserDto.email} is already in use by another user`,
        );
      }
      user.email = updateUserDto.email;
    }

    user.firstname = updateUserDto.firstname ?? user.firstname;
    user.lastname = updateUserDto.lastname ?? user.lastname;
    user.phone = updateUserDto.phone ?? user.phone;
    user.birthday = updateUserDto.birthday ?? user.birthday;

    try {
      await this.userRepo.update(user.id, user);
    } catch (error) {
      throw new BadRequestException(`Error updating user: ${error.message}`);
    }
  }

  async updateProfileImage(id: number, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');

    const user = await this.findById(id);
    user.profile_image = file.buffer;
    try {
      await this.userRepo.save(user);
    } catch (error) {
      throw new BadRequestException(
        `Error updating profile image: ${error.message}`,
      );
    }
    const { profile_image } = user;
    return profile_image;
  }

  async findById(id: number) {
    const user = await this.userRepo.findOneBy({ id: id });
    if (!user) {
      throw new BadRequestException(`User with ID ${id} not found`);
    }
    return user;
  }

  async getById(id: number) {
    const user = await this.userRepo.findOneBy({ id: id });
    if (!user) {
      throw new BadRequestException(`User with ID ${id} not found`);
    }
    const { password, ...result } = user;
    return result;
  }

  async delete(id: number) {
    const user = await this.userRepo.findOneBy({ id: id });
    if (!user) {
      throw new BadRequestException(`User with ID ${id} not found`);
    }
    try {
      await this.userRepo.delete(id);
    } catch (error) {
      throw new BadRequestException(`Error deleting user: ${error.message}`);
    }
  }

  async resetPassword(id: number, data: { new: string }) {
    const user = await this.findById(id);
    try {
      const hashedPassword = await hash(data.new, 10);
      user.password = hashedPassword;
      await this.userRepo.update(user.id, user);
    } catch (error) {
      throw new BadRequestException(
        `Error updating password: ${error.message}`,
      );
    }
  }

  async updatePassword(id: number, data: { new: string; current: string }) {
    const user = await this.findById(id);
    try {
      const checkpassword = await compare(data.current, user.password);
      if (!checkpassword) {
        throw new BadRequestException('Incorrect password');
      }

      const hashedPassword = await hash(data.new, 10);
      user.password = hashedPassword;
      await this.userRepo.update(user.id, user);
    } catch (error) {
      throw new BadRequestException(
        `Error updating password: ${error.message}`,
      );
    }
  }

  async createEvent(eventDto: CreateEventDto, userId: number) {
    const user = await this.findById(userId);
    const event = this.eventRepo.create({
      name: eventDto.name,
      description: eventDto.description,
      date: eventDto.date,
      location: eventDto.location,
      wishlist: { active: false, items: [] },
    });

    try {
      await this.eventRepo.save(event);
    } catch (error) {
      throw new BadRequestException(`Error creating event: ${error.message}`);
    }

    try {
      const userEvent = this.userEventRepo.create({
        user: user,
        event: event,
        role: 'Organizer',
      });
      await this.userEventRepo.save(userEvent);
      const { image_id, ...data } = userEvent.event;
      const owner = user.firstname + ' ' + user.lastname;
      return { owner, participants: 1, ...data, image: null };
    } catch (error) {
      throw new BadRequestException(`Error creating event: ${error.message}`);
    }
  }

  async getUserOwnEvents(userId: number) {
    const user = await this.findById(userId);

    const temp = await this.userEventRepo.find({
      where: { user: { id: userId }, role: 'Organizer' },
      relations: ['event'],
    });

    const events = await Promise.all(
      temp.map(async (userEvent) => {
        const participants = await this.userEventRepo.findBy({
          eventId: userEvent.event.id,
        });
        const image = await this.imageRepo
          .findOneBy({
            event_id: userEvent.event.id,
          })
          .then((image) => image?.image) ?? null;

        const owner = user.firstname + ' ' + user.lastname;

        const { image_id, ...data } = userEvent.event;

        return {
          owner,
          participants: participants.length,
          ...data,
          image,
        };
      }),
    );
    return events;
  }

  async getUserGuestEvents(userId: number) {
    await this.findById(userId);
    const temp = await this.userEventRepo.find({
      where: { user: { id: userId }, role: 'Guest' },
      relations: ['event'],
    });

    const events = await Promise.all(
      temp.map(async (userEvent) => {
        const participants = await this.userEventRepo.findBy({
          eventId: userEvent.event.id,
        });

        const image =
          (await this.imageRepo
            .findOneBy({
              event_id: userEvent.event.id,
            })
            .then((image) => image?.image)) ?? null;

        const owner = await this.userEventRepo
          .find({
            relations: ['event', 'user'],
            where: {
              eventId: userEvent.event.id,
              role: 'Organizer',
            },
          })
          .then(
            (userEvent) =>
              userEvent[0].user.firstname + ' ' + userEvent[0].user.lastname,
          );

        const { image_id, ...data } = userEvent.event;
        return {
          owner,
          participants: participants.length,
          ...data,
          image,
        };
      }),
    );
    return events;
  }
}
