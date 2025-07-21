import { Test, TestingModule } from '@nestjs/testing';
import { SalesDetailsController } from './sales-details.controller';

describe('SalesDetailsController', () => {
  let controller: SalesDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesDetailsController],
    }).compile();

    controller = module.get<SalesDetailsController>(SalesDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
