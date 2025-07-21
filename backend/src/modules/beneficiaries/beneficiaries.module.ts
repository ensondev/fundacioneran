import { Module } from '@nestjs/common';
import { BeneficiariesService } from './beneficiaries.service';
import { BeneficiariesController } from './beneficiaries.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [BeneficiariesService, DatabaseService],
  controllers: [BeneficiariesController]
})
export class BeneficiariesModule {}
