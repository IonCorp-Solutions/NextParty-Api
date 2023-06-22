import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { EventsController } from './controller/events.controller';
import { Event } from './entities/event.entity';
import { EventsService } from './service/events.service';
import { UserEvent } from '@user_event/entities/user_event.entity';
import { Image } from '@images/entities/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, User, UserEvent, Image])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
