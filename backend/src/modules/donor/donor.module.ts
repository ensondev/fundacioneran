import { Module } from '@nestjs/common';
import { DonorService } from './donor.service';
import { DonorController } from './donor.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [DonorService, DatabaseService],
  controllers: [DonorController]
})
export class DonorModule {}
