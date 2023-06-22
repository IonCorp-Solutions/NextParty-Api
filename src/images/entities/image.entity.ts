import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from '@events/entities/event.entity';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'longblob', nullable: false })
  image: Buffer;

  @Column({ type: 'varchar', nullable: true })
  event_id: number;

  @OneToOne(() => Event, (event) => event.image)
  @JoinColumn({ name: 'event_id' })
  event: Event;
}
