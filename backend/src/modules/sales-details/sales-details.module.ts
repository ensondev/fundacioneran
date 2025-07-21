import { Module } from '@nestjs/common';
import { SalesDetailsService } from './sales-details.service';
import { SalesDetailsController } from './sales-details.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [SalesDetailsService, DatabaseService],
  controllers: [SalesDetailsController]
})
export class SalesDetailsModule {}
