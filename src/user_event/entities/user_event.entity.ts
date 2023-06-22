import { User } from '@users/entities/user.entity';
import { Event } from '@events/entities/event.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('user_event')
export class UserEvent {
  @ManyToOne(() => User, (user) => user.events)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Event, (event) => event.users)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'event_id' })
  eventId: number;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    default: 'Organizer',
  })
  role: string;

  @BeforeInsert()
  checkRole() {
    if (this.role !== 'Organizer' && this.role !== 'Guest') {
      throw new Error('Invalid role');
    }
  }
}
