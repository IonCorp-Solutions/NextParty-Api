import { PartialType } from '@nestjs/mapped-types';
import { CreateUserEventDto } from './create-user_event.dto';

export class UpdateUserEventDto extends PartialType(CreateUserEventDto) {}
