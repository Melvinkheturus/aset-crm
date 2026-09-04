import { Controller, Get, Post, Patch, Param, Query, Body } from '@nestjs/common';
import { SchoolsService } from './schools.service';

@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.schoolsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.schoolsService.findOne(id);
  }

  @Post()
  async create(@Body() createDto: any) {
    return this.schoolsService.create(createDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.schoolsService.update(id, updateDto);
  }
}
