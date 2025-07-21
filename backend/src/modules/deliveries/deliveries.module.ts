import { Module } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { DeliveriesController } from './deliveries.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [DeliveriesService, DatabaseService],
  controllers: [DeliveriesController]
})
export class DeliveriesModule {}
