import { Test, TestingModule } from '@nestjs/testing';
import { SalesHeaderService } from './sales-header.service';

describe('SalesHeaderService', () => {
  let service: SalesHeaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesHeaderService],
    }).compile();

    service = module.get<SalesHeaderService>(SalesHeaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
