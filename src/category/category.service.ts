import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { RedisClientType } from 'redis';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existing = await this.categoryRepo.findOne({
      where: { name: createCategoryDto.name },
    });
    if (existing) {
      throw new Error('This category is already exist!');
    }
    const category = this.categoryRepo.create(createCategoryDto);
    const savedCategory = await this.categoryRepo.save(category);
    if (savedCategory) {
      await this.redisClient.del(`category:all`);
    }
    return savedCategory;
  }

  async findAll() {
    const cachedKey = `category:all`;
    const cached = await this.redisClient.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const categories = await this.categoryRepo.find();
    if (categories) {
      await this.redisClient.set(cachedKey, JSON.stringify(categories), {
        EX: 60 * 5,
      });
    }
    return categories;
  }

  async findByBlog(id: number) {
    const cachedKey = `category-blog:${id}`;
    const cached = await this.redisClient.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const categories = await this.categoryRepo.find({
      where: { blog_category: { blog: { id } } },
    });
    if (categories) {
      return this.redisClient.set(cachedKey, JSON.stringify(categories), {
        EX: 60 * 5,
      });
    }
    return categories;
  }

  async findOne(id: number) {
    const cachedKey = `category-blog:${id}`;
    const cached = await this.redisClient.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const category = this.categoryRepo.findOne({ where: { id } });
    if (category) {
      return this.redisClient.set(cachedKey, JSON.stringify(category), {
        EX: 60 * 5,
      });
    }
    return category;
  }

  findMany(name?: string) {
    return this.categoryRepo.find({
      where: { name: Like(`%${name}%`) },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const existing = await this.categoryRepo.findOne({
      where: { name: updateCategoryDto.name },
    });
    if (existing && existing.id !== id) {
      throw new Error('This category is already exist!');
    }

    await this.categoryRepo.update({ id }, updateCategoryDto);
    const updatedCategory = await this.categoryRepo.findOne({ where: { id } });
    if (updatedCategory) {
      await this.redisClient.del('blog:all');
    }
    return updatedCategory;
  }
}
