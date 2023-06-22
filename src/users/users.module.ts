import { Event } from '@events/entities/event.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controller/users.controller';
import { User } from './entities/user.entity';
import { UsersService } from './service/users.service';
import { UserEvent } from '@user_event/entities/user_event.entity';
import { Image } from '@images/entities/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Event, UserEvent, Image])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
