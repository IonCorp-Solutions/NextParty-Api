import { Controller } from '@nestjs/common';
import { CategoriesService } from '../service/categories.service';

// @ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  // @Get()
  // async getAll(): Promise<Categories[]> {
  //   return await this.service.getAll();
  // }

  // @Post()
  // async create(@Body() item: Categories) {
  //   return await this.service.create(item);
  // }

  // @Put(':id')
  // async update(@Param('id') id: number, @Body() item: Categories) {
  //   return await this.service.update(id, item);
  // }

  // @Delete(':id')
  // async delete(@Param('id') id: number) {
  //   return await this.service.delete(id);
  // }
}
