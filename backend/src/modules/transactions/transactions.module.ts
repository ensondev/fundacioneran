import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { DatabaseService } from 'src/database/database.service';
import { TransactionsController } from './transactions.controller';

@Module({
    providers: [TransactionsService, DatabaseService],
    controllers: [TransactionsController]
})
export class TransactionsModule { }
