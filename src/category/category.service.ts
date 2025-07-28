import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existing = await this.categoryRepo.findOne({
      where: { name: createCategoryDto.name },
    });
    if (existing) {
      throw new Error('This category is already exist!');
    }
    const category = this.categoryRepo.create(createCategoryDto);
    return await this.categoryRepo.save(category);
  }

  findAll() {
    return this.categoryRepo.find();
  }

  findByBlog(id: number) {
    return this.categoryRepo.find({
      where: { blog_category: { blog: { id } } },
    });
  }

  findOne(id: number) {
    return this.categoryRepo.findOne({ where: { id } });
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
    return await this.categoryRepo.findOne({ where: { id } });
  }
}
