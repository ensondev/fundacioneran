import { Module } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { RegistrationsController } from './registrations.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [RegistrationsService, DatabaseService],
  controllers: [RegistrationsController]
})
export class RegistrationsModule {}
