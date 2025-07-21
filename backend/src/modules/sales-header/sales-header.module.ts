import { Module } from '@nestjs/common';
import { SalesHeaderService } from './sales-header.service';
import { SalesHeaderController } from './sales-header.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [SalesHeaderService, DatabaseService],
  controllers: [SalesHeaderController]
})
export class SalesHeaderModule { }
