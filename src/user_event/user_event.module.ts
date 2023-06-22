import { Module } from '@nestjs/common';
import { UserEventService } from './service/user_event.service';
import { UserEventController } from './controller/user_event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { Event } from '@events/entities/event.entity';
import { UserEvent } from './entities/user_event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Event, UserEvent])],
  controllers: [UserEventController],
  providers: [UserEventService],
})
export class UserEventModule {}
