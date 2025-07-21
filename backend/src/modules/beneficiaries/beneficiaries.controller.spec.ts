import { Test, TestingModule } from '@nestjs/testing';
import { BeneficiariesController } from './beneficiaries.controller';

describe('BeneficiariesController', () => {
  let controller: BeneficiariesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BeneficiariesController],
    }).compile();

    controller = module.get<BeneficiariesController>(BeneficiariesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
