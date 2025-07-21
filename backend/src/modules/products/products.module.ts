import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [ProductsService, DatabaseService],
  controllers: [ProductsController]
})
export class ProductsModule {}
