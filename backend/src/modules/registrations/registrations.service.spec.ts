import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationsService } from './registrations.service';

describe('RegistrationsService', () => {
  let service: RegistrationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegistrationsService],
    }).compile();

    service = module.get<RegistrationsService>(RegistrationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
