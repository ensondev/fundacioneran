import { Test, TestingModule } from '@nestjs/testing';
import { SalesHeaderController } from './sales-header.controller';

describe('SalesHeaderController', () => {
  let controller: SalesHeaderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesHeaderController],
    }).compile();

    controller = module.get<SalesHeaderController>(SalesHeaderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
