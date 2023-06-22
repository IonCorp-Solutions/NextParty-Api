import { Controller } from '@nestjs/common';
import { ImagesService } from '../service/images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  // @UseGuards(JwtAuthGuard)
  // @Post()
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: memoryStorage(),
  //     fileFilter: filterExtention,
  //   }),
  // )
  // async create(@UploadedFile() file: Express.Multer.File) {
  //   return this.imagesService.create(file);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Put(':id')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: memoryStorage(),
  //     fileFilter: filterExtention,
  //   }),
  // )
  // async update(
  //   @Param('id') id: number,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   return this.imagesService.update(id, file);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Delete(':id')
  // async delete(@Param('id') id: number): Promise<void> {
  //   return this.imagesService.delete(id);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get(':id')
  // async findOne(@Param('id') id: number) {
  //   return this.imagesService.findOne(id);
  // }
}
