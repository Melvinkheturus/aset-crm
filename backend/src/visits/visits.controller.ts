import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { VisitsService } from './visits.service';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.visitsService.findAll(query);
  }

  @Get('stats')
  async getStats() {
    return this.visitsService.getStats();
  }

  @Post()
  async create(@Body() createDto: any) {
    return this.visitsService.create(createDto);
  }
}
