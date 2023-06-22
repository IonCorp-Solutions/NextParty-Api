import { ForgotPassDto } from '@auth/dto/forgot-pass.dto';
import { RegisterUserDto } from '@auth/dto/register.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { UsersService } from '@users/service/users.service';
import { LoginUserDto } from './../dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(user: RegisterUserDto) {
    return this.userService.create(user);
  }

  async login(user: LoginUserDto) {
    const finduser = await this.userService.getByEmail(user.email);
    const checkpassword = await compare(user.password, finduser.password);
    if (!checkpassword) {
      throw new BadRequestException('Password is incorrect');
    }
    const payload = { id: finduser.id, email: finduser.email };
    const token = this.jwtService.sign(payload);
    const data = {
      user: {
        id: finduser.id,
        email: finduser.email,
        firstname: finduser.firstname,
        lastname: finduser.lastname,
        phone: finduser.phone,
        birthday: finduser.birthday,
        profile_image: finduser.profile_image,
      },
      token: token,
    };
    return data;
  }

  async sendResetPasswordEmail(o: ForgotPassDto) {
    const user = await this.userService.getByEmail(o.email);
    const token = this.jwtService.sign({ id: user.id });
    const resetUrl = `https://nextparty-app.vercel.app/reset/${token}`;
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'next.party.mailer@gmail.com',
        pass: '--------------',
      },
    });
    const mailOptions = {
      from: 'next.party.mailer@gmail.com',
      to: o.email,
      subject: 'Password Reset Request',
      text: `Hi ${user.firstname.toUpperCase()} ${user.lastname.toUpperCase()},\n\nPlease click on the following link to reset your password:\n ${resetUrl} \n If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      throw new BadRequestException('Email is invalid');
    }
  }

  async resetPassword(data: { new: string; token: string }) {
    const { id } = this.jwtService.verify(data.token);
    return await this.userService.resetPassword(id, data);
  }

  async changePassword(id: number, data: { new: string; current: string }) {
    return await this.userService.updatePassword(id, data);
  }

  async tokenVerify(token: string) {
    const decode = this.jwtService.decode(token);
    try {
      await this.userService.getById(decode['id']);
      const experitaion = new Date(decode['exp'] * 1000);
      if (experitaion < new Date()) {
        throw new BadRequestException('Token is invalid');
      }
      return {
        validate: true,
      };
    } catch {
      throw new BadRequestException('Token is invalid');
    }
  }
}
