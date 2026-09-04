import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { PlansService } from './plans.service';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.plansService.findAll(query);
  }

  @Post()
  async create(@Body() createDto: any) {
    return this.plansService.create(createDto);
  }

  @Patch(':id/reorder')
  async updateOrder(@Param('id') id: string, @Body('visit_order') order: number) {
    return this.plansService.updateOrder(id, order);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.plansService.updateStatus(id, status);
  }
}
