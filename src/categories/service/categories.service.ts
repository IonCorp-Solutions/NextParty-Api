import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categories } from '../entities/category.entity';
import { CreateCategoryDto } from './../dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories) private repo: Repository<Categories>,
  ) {}

  getAll(): Promise<Categories[]> {
    return this.repo.find();
  }

  async create(item: CreateCategoryDto) {
    const items = await this.repo.findBy({
      category: item.category,
    });
    if (items.length) throw new BadRequestException('Category already exists');
    try {
      await this.repo.save(item);
    } catch (error) {
      throw new BadRequestException(
        `Error creating category: ${error.message}`,
      );
    }
  }

  async update(id: number, item: Categories) {
    const itemExists = await this.repo.findOneBy({ id: id });
    if (!itemExists) throw new BadRequestException('Category does not exist');
    const items = await this.repo.findBy({
      category: item.category,
    });
    if (items.length) throw new BadRequestException('Category already exists');

    try {
      await this.repo.update(id, item);
    } catch (error) {
      throw new BadRequestException(
        `Error updating category: ${error.message}`,
      );
    }
  }

  async delete(id: number) {
    try {
      await this.repo.delete(id);
    } catch (error) {
      throw new BadRequestException(
        `Error deleting category: ${error.message}`,
      );
    }
  }
}
