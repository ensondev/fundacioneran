import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [CategoriesService, DatabaseService],
  controllers: [CategoriesController]
})
export class CategoriesModule {}
