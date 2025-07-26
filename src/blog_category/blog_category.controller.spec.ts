import { Test, TestingModule } from '@nestjs/testing';
import { BlogCategoryController } from './blog_category.controller';
import { BlogCategoryService } from './blog_category.service';

describe('BlogCategoryController', () => {
  let controller: BlogCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogCategoryController],
      providers: [BlogCategoryService],
    }).compile();

    controller = module.get<BlogCategoryController>(BlogCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
