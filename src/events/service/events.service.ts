import { InviteEmailDto } from '@events/dto/invite-email.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { Repository } from 'typeorm';
import { Event, Item } from '../entities/event.entity';
import { UserEvent } from '@user_event/entities/user_event.entity';
import { Image } from '@images/entities/image.entity';
import { Express } from 'express';
import { UpdateEventDto } from '@events/dto/update-event.dto';
@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private eventRepo: Repository<Event>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserEvent) private userEventRepo: Repository<UserEvent>,
    @InjectRepository(Image) private imageRepo: Repository<Image>,
  ) {}

  async getEventById(eventId: number) {
    const event = await this.eventRepo.findOneBy({ id: eventId });
    if (!event) {
      throw new BadRequestException(`Event with id ${eventId} not found`);
    }

    const participants = await this.getNumberOfParticipants(eventId);

    const image = await this.imageRepo.findOneBy({ event_id: eventId });

    return { ...event, image: image, participants };
  }

  async updateEvent(eventId: number, data: UpdateEventDto) {
    const event = await this.eventRepo.findOneBy({ id: eventId });
    if (!event) {
      throw new BadRequestException(`Event with id ${eventId} not found`);
    }
    event.name = data.name ? data.name : event.name;
    event.description = data.description ? data.description : event.description;
    event.date = data.date ? data.date : event.date;
    event.location = data.location ? data.location : event.location;

    try {
      await this.eventRepo.save(event);
    } catch (error) {
      throw new BadRequestException(`Error updating event: ${error.message}`);
    }
    return;
  }

  async deleteEvent(eventId: number) {
    await this.getEventById(eventId);
    await this.eventRepo
      .createQueryBuilder()
      .delete()
      .from('user_event')
      .where('event_id = :id', { id: eventId })
      .execute();
    try {
      await this.eventRepo.delete({ id: eventId });
    } catch (error) {
      throw new BadRequestException(`Error deleting event: ${error.message}`);
    }
    return;
  }

  async updateEventImage(eventId: number, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No image provided');
    }

    const event = await this.getEventById(eventId);

    if (event.image_id == null) {
      const image = this.imageRepo.create({
        event: event,
        image: file.buffer,
      });
      try {
        await this.imageRepo.save(image);
        event.image = image;
        await this.eventRepo.save(event);
      } catch (error) {
        throw new BadRequestException(
          `Error updating event image: ${error.message}`,
        );
      }
    }

    try {
      const image = await this.imageRepo.findOneBy({ id: event.image_id });
      image.image = file.buffer;
      await this.imageRepo.save(image);
    } catch (error) {
      throw new BadRequestException(
        `Error updating event image: ${error.message}`,
      );
    }
  }

  async getEventImage(eventId: number) {
    try {
      const image = await this.imageRepo.findOneBy({ event_id: eventId });
      return image.image;
    } catch (error) {
      throw new BadRequestException(
        `Error getting event image: ${error.message}`,
      );
    }
  }

  async getWishlist(eventId: number) {
    try {
      return await this.eventRepo.find({
        select: ['wishlist'],
        where: { id: eventId },
      });
    } catch (error) {
      throw new BadRequestException(`Error getting wishlist: ${error.message}`);
    }
  }

  async addItem(eventId: number, item: Item) {
    if (!item.name || !item.description || !item.quantity) {
      throw new BadRequestException(
        'Item must have a name, description and quantity',
      );
    }

    const event = await this.eventRepo.findOneBy({ id: eventId });
    if (!event) {
      throw new BadRequestException(`Event with id ${eventId} not found`);
    }

    let list = event.wishlist.active
      ? event.wishlist
      : { active: true, items: [] };

    list = { ...list, items: [...list.items, item] };

    event.wishlist = list;

    try {
      await this.eventRepo.save(event);
    } catch (error) {
      throw new BadRequestException(
        `Error adding wishlist item: ${error.message}`,
      );
    }
  }

  async updateItem(eventId: number, itemId: number, item: Item) {
    const event = await this.eventRepo.findOneBy({ id: eventId });
    if (!event) {
      throw new BadRequestException(`Event with id ${eventId} not found`);
    }

    const list = event.wishlist;

    if (!list.items[itemId]) {
      throw new BadRequestException(`Item with id ${itemId} not found`);
    }

    list.items[itemId] = {
      ...list.items[itemId],
      ...item,
    };

    event.wishlist = list;

    try {
      await this.eventRepo.save(event);
    } catch (error) {
      throw new BadRequestException(
        `Error updating wishlist item: ${error.message}`,
      );
    }
  }

  async updateItemImage(
    eventId: number,
    itemid: number,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const event = await this.getEventById(eventId);

    const item = event.wishlist.items[itemid];
    if (!item)
      throw new BadRequestException(`Item with id ${itemid} not found`);

    if (item.image == null) {
      try {
        const img = await this.imageRepo.save({ image: file.buffer });

        item.image = img.id;

        event.wishlist.items[itemid] = item;

        await this.eventRepo.save(event);
      } catch (error) {
        throw new BadRequestException(
          `Error updating item image: ${error.message}`,
        );
      }
    } else {
      const img = await this.imageRepo.findOneBy({ id: item.image });
      img.image = file.buffer;
      try {
        await this.imageRepo.save(img);
      } catch (error) {
        throw new BadRequestException(
          `Error updating item image: ${error.message}`,
        );
      }
    }
  }

  async deleteItem(eventId: number, itemId: number) {
    const event = await this.eventRepo.findOneBy({ id: eventId });
    if (!event) {
      throw new BadRequestException(`Event with id ${eventId} not found`);
    }

    const list = event.wishlist;

    if (!list.items[itemId]) {
      throw new BadRequestException(`Item with id ${itemId} not found`);
    }

    list.items.splice(itemId, 1);

    event.wishlist = list;

    try {
      await this.eventRepo.save(event);
    } catch (error) {
      throw new BadRequestException(
        `Error deleting wishlist item: ${error.message}`,
      );
    }
  }

  async inviteUserByEmail(eventId: number, invite: InviteEmailDto) {
    const event = await this.getEventById(eventId);

    const user = await this.userRepo.findOneBy({ email: invite.email });
    if (!user) {
      throw new BadRequestException(
        `User with email ${invite.email} not found`,
      );
    }

    const check = await this.userEventRepo.findOneBy({
      eventId: event.id,
      userId: user.id,
    });
    if (check) {
      throw new BadRequestException(
        `User with email ${invite.email} is already invited`,
      );
    }

    const userEvent = this.userEventRepo.create({
      user,
      event,
      role: 'Guest',
    });

    try {
      await this.userEventRepo.save(userEvent);
    } catch (error) {
      throw new BadRequestException(
        `Error inviting user to event: ${error.message}`,
      );
    }
  }

  async getNumberOfParticipants(eventId: number) {
    const participants = await this.userEventRepo.findBy({
      eventId: eventId,
    });

    return participants.length;
  }
}
