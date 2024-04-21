import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventService } from '../../@core/events/application/event.service';
import { EventDto } from './event.dto';

@Controller('events')
export class EventsController {

  constructor(private eventService: EventService) {}

  @Get()
  async list() {
    return await this.eventService.list();
  }

  @Post()
  create(@Body() body: EventDto) {
    return this.eventService.create(body);
  }
}
