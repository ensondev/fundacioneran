import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [SubjectService, DatabaseService],
  controllers: [SubjectController]
})
export class SubjectModule {}
