import { Controller, Get } from '@nestjs/common';
import { UserEventService } from '../service/user_event.service';

@Controller('user-event')
export class UserEventController {
  constructor(private readonly userEventService: UserEventService) {}
}
