import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../entities/image.entity';
import { Express } from 'express';

@Injectable()
export class ImagesService {
  constructor(@InjectRepository(Image) private imageRepo: Repository<Image>) {}

  async create(file: Express.Multer.File) {
    try {
      await this.imageRepo.save({ image: file.buffer });
    } catch (error) {
      throw new BadRequestException(`Error creating image: ${error.message}`);
    }
  }

  async delete(id: number) {
    try {
      this.imageRepo.delete({ id: id });
    } catch (error) {
      throw new BadRequestException(`Error deleting image: ${error.message}`);
    }
    return;
  }

  async update(id: number, file: Express.Multer.File) {
    let example = await this.findOne(id);
    example.image = file.buffer;
    try {
      this.imageRepo.save(example);
    } catch (error) {
      throw new BadRequestException(`Error updating image: ${error.message}`);
    }
    return;
  }

  async findOne(id: number) {
    let res = await this.imageRepo.findOneBy({ id: id });
    if (!res) {
      throw new BadRequestException('Image not found');
    }
    return res;
  }
}
