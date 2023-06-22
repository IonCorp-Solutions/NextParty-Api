import { IsEmail, IsNotEmpty } from 'class-validator';

export class InviteEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
