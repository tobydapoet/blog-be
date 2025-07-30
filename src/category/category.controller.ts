import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { error } from 'console';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(Role.ADMIN, Role.STAFF)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      const res = await this.categoryService.create(createCategoryDto);
      return {
        success: true,
        data: res,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('search')
  findMany(@Query('name') name: string) {
    return this.categoryService.findMany(name);
  }

  @Get('blog/:id')
  findByBlog(@Param('id') id: number) {
    return this.categoryService.findByBlog(id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.categoryService.findOne(+id);
  }

  @Roles(Role.ADMIN, Role.STAFF)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      const res = await this.categoryService.update(+id, updateCategoryDto);
      return {
        success: true,
        data: res,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }
  }
}
