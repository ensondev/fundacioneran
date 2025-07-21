import { Test, TestingModule } from '@nestjs/testing';
import { SalesDetailsService } from './sales-details.service';

describe('SalesDetailsService', () => {
  let service: SalesDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesDetailsService],
    }).compile();

    service = module.get<SalesDetailsService>(SalesDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
