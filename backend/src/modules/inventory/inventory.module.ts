import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [InventoryService, DatabaseService],
  controllers: [InventoryController]
})
export class InventoryModule {}
