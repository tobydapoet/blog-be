import { Test, TestingModule } from '@nestjs/testing';
import { UploadCloundiaryController } from './upload_cloundiary.controller';

describe('UploadCloundiaryController', () => {
  let controller: UploadCloundiaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadCloundiaryController],
    }).compile();

    controller = module.get<UploadCloundiaryController>(UploadCloundiaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
