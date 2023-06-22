import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class ForgotPassDto {
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 50)
  email: string;
}
