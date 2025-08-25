import { Module } from '@nestjs/common';
import { InfantsService } from './infants.service';
import { InfantsController } from './infants.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [InfantsService, DatabaseService],
  controllers: [InfantsController]
})
export class InfantsModule {}
