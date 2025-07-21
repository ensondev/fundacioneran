import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [WarehouseService, DatabaseService],
  controllers: [WarehouseController]
})
export class WarehouseModule {}
