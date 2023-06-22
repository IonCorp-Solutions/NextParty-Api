import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { Item } from '@events/entities/event.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EventsService } from '../service/events.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { filterExtention } from '@images/helper/images.helper';
import { UpdateEventDto } from '@events/dto/update-event.dto';

@ApiBearerAuth()
@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getEvent(@Param('id') eventId: number) {
    return this.eventsService.getEventById(eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateEvent(
    @Param('id') eventId: number,
    @Body() body: UpdateEventDto,
  ) {
    return this.eventsService.updateEvent(eventId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteEvent(@Param('id') eventId: number) {
    return this.eventsService.deleteEvent(eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: filterExtention,
    }),
  )
  async uploadEventImage(
    @Param('id') eventId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.eventsService.updateEventImage(eventId, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/image')
  async getEventImage(@Param('id') eventId: number) {
    return this.eventsService.getEventImage(eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/wishlist')
  async getWishlist(@Param('id') eventId: number) {
    return this.eventsService.getWishlist(eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/item')
  async addItemToWishlist(@Param('id') eventId: number, @Body() body: Item) {
    return this.eventsService.addItem(eventId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/item/:itemId')
  async updateItemInWishlist(
    @Param('id') eventId: number,
    @Param('itemId') itemId: number,
    @Body() body: Item,
  ) {
    return this.eventsService.updateItem(eventId, itemId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/item/:itemId/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: filterExtention,
    }),
  )
  async updateItemImage(
    @Param('id') eventId: number,
    @Param('itemId') itemId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.eventsService.updateItemImage(eventId, itemId, file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/item/:itemId')
  async deleteItemInWishlist(
    @Param('id') eventId: number,
    @Param('itemId') itemId: number,
  ) {
    return this.eventsService.deleteItem(eventId, itemId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/invite')
  async inviteUserByEmail(
    @Param('id') eventId: number,
    @Body() body: { email: string },
  ) {
    return this.eventsService.inviteUserByEmail(eventId, body);
  }
}
