import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  async getDashboard() {
    return this.reportsService.getDashboard();
  }

  @Get('daily')
  async getDaily(@Query('date') date?: string) {
    return this.reportsService.getDailyReport(date);
  }

  @Get('weekly')
  async getWeekly(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.reportsService.getWeeklyReport(startDate, endDate);
  }

  @Get('monthly')
  async getMonthly() {
    return this.reportsService.getMonthlyReport();
  }

  @Get('management')
  async getManagement() {
    return this.reportsService.getManagementView();
  }
}
