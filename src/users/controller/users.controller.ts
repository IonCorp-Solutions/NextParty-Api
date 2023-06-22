import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { CreateEventDto } from '@events/dto/create-event.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersService } from '../service/users.service';
import { filterExtention } from 'src/images/helper/images.helper';
import { memoryStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.getById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() user: UpdateUserDto) {
    return this.usersService.update(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: filterExtention,
    }),
  )
  async uploadProfileImage(
    @Param('id') userId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.updateProfileImage(userId, file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.usersService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/events')
  async create(
    @Param('id') userId: number,
    @Body() createUserEventDto: CreateEventDto,
  ) {
    return this.usersService.createEvent(createUserEventDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/events/own')
  async OwnEvents(@Param('id') userId: number) {
    return this.usersService.getUserOwnEvents(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/events/invited')
  async GuestEvents(@Param('id') userId: number) {
    return this.usersService.getUserGuestEvents(userId);
  }
}
