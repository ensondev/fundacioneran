import { Module } from '@nestjs/common';
import { InstructorsService } from './instructors.service';
import { InstructorsController } from './instructors.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [InstructorsService, DatabaseService],
  controllers: [InstructorsController]
})
export class InstructorsModule {}
