import { Test, TestingModule } from '@nestjs/testing';
import { UploadCloundiaryService } from './upload_cloundiary.service';

describe('UploadCloundiaryService', () => {
  let service: UploadCloundiaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadCloundiaryService],
    }).compile();

    service = module.get<UploadCloundiaryService>(UploadCloundiaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
