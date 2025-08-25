import { Test, TestingModule } from '@nestjs/testing';
import { InfantsController } from './infants.controller';

describe('InfantsController', () => {
  let controller: InfantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfantsController],
    }).compile();

    controller = module.get<InfantsController>(InfantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
