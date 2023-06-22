import { IsDate, IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 60)
  firstname: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 60)
  lastname: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(1, 50)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 100)
  password: string;

  @IsString()
  @Length(9, 9)
  phone?: string;

  @IsDate()
  birthday?: Date;
}
