import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 50)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 100)
  password: string;
}
