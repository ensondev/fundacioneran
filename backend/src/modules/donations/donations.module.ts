import { Module } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [DonationsService, DatabaseService],
  controllers: [DonationsController]
})
export class DonationsModule {}
