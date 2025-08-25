import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [CoursesService, DatabaseService],
  controllers: [CoursesController]
})
export class CoursesModule {}
