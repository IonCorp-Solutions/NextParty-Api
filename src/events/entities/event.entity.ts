import { User } from '@users/entities/user.entity';
import { Image } from '@images/entities/image.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export class Item {
  name: string;

  description: string;

  quantity: number;

  image: number;

  taken: {
    takenby: number;
    taken: boolean;
  }[];
}

export class Wishlist {
  active: boolean;
  items: Item[];
}
@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, length: 100 })
  name: string;

  @Column({ type: 'varchar', nullable: false, length: 600 })
  description: string;

  @Column({ type: 'varchar', nullable: true, length: 100 })
  location: string;

  @Column({ type: 'datetime', nullable: true })
  date: Date;

  @Column({ type: 'json', nullable: true })
  wishlist: Wishlist;

  @Column({ type: 'number', nullable: true })
  image_id: number;

  @OneToOne(() => Image, (image) => image.event)
  @JoinColumn({ name: 'image_id' })
  image: Image;

  @ManyToMany(() => User, (user) => user.events)
  @JoinTable({
    name: 'user_event',
    joinColumn: {
      name: 'event_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: User[];
}
