import { Test, TestingModule } from '@nestjs/testing';
import { DonationsController } from './donations.controller';

describe('DonationsController', () => {
  let controller: DonationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonationsController],
    }).compile();

    controller = module.get<DonationsController>(DonationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
