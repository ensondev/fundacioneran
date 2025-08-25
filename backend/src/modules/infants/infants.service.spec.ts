import { Test, TestingModule } from '@nestjs/testing';
import { InfantsService } from './infants.service';

describe('InfantsService', () => {
  let service: InfantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InfantsService],
    }).compile();

    service = module.get<InfantsService>(InfantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
