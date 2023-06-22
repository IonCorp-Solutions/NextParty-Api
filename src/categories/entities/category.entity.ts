import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('categories')
export class Categories {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  category: string;

  @BeforeInsert()
  @BeforeUpdate()
  async lowercase() {
    this.category = this.category.toLowerCase();
  }
}
