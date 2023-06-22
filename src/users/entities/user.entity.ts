import { Event } from '@events/entities/event.entity';
import { hash } from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 60, nullable: false })
  firstname: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  lastname: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 9, nullable: true })
  phone: string;

  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @Column({ type: 'longblob', nullable: true })
  profile_image: Buffer;

  @BeforeInsert()
  @BeforeUpdate()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @ManyToMany(() => Event, (event) => event.users, { cascade: true })
  @JoinTable({
    name: 'user_event',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'event_id',
      referencedColumnName: 'id',
    },
  })
  events: Event[];
}
