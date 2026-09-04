import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { SchoolsModule } from './schools/schools.module';
import { VisitsModule } from './visits/visits.module';
import { PlansModule } from './plans/plans.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule,
    SchoolsModule,
    VisitsModule,
    PlansModule,
    ReportsModule,
  ],
})
export class AppModule {}
