import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @Length(1, 60)
  firstname?: string;

  @IsOptional()
  @IsString()
  @Length(1, 60)
  lastname?: string;

  @IsOptional()
  @IsEmail()
  @Length(1, 50)
  email?: string;

  @IsOptional()
  @IsString()
  @Length(9, 9)
  phone?: string;

  @IsOptional()
  birthday?: Date;
}
