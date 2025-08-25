import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsController } from './participants.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [ParticipantsService, DatabaseService],
  controllers: [ParticipantsController]
})
export class ParticipantsModule {}
