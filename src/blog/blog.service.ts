import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Like, Repository } from 'typeorm';
import { UploadCloundiaryService } from 'src/upload_cloundiary/upload_cloundiary.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private blogRepo: Repository<Blog>,
    private uploadService: UploadCloundiaryService,
  ) {}
  async create(createBlogDto: CreateBlogDto, file: Express.Multer.File) {
    const base64Images = createBlogDto.content.match(
      /<img[^>]+src="data:image\/[^;]+;base64[^"]+"[^>]*>/g,
    );
    if (base64Images != null) {
      for (const image of base64Images) {
        const base64Match = image.match(
          /src="(data:image\/[^;]+;base64[^"]+)"/,
        );
        if (base64Match) {
          const base64Data = base64Match[1];
          const buffer = Buffer.from(base64Data.split(',')[1], 'base64');
          const uploadResult = await this.uploadService.uploadImage(
            buffer,
            'blog',
          );

          createBlogDto.content = createBlogDto.content.replace(
            base64Data,
            uploadResult.url,
          );
        }
      }
    }

    const uploadThumbnail = await this.uploadService.uploadImage(
      file.buffer,
      'thumbnail',
    );

    createBlogDto.thumbnail = uploadThumbnail.url;

    const blog = this.blogRepo.create({
      ...createBlogDto,
      client: { id: createBlogDto.clientId },
    });
    return await this.blogRepo.save(blog);
  }

  findAll() {
    return this.blogRepo.find();
  }

  findOne(id: number) {
    return this.blogRepo.findOne({ where: { id } });
  }

  findByClient(id: number) {
    return this.blogRepo.find({ where: { client: { id } } });
  }

  findMany(keyword: string) {
    return this.blogRepo.find({
      where: [
        { title: Like(`%${keyword}%`) },
        { client: { account: { name: Like(`%${keyword}%`) } } },
      ],
    });
  }

  findByCategory(category: string) {
    return this.blogRepo.find({
      where: { blog_categories: { category: { name: category } } },
    });
  }

  async update(
    id: number,
    updateBlogDto: UpdateBlogDto,
    file: Express.Multer.File,
  ) {
    if (updateBlogDto.content) {
      const base64Images = updateBlogDto.content.match(
        /<img[^>]+src="data:image\/[^;]+;base64[^"]+"[^>]*>/g,
      );
      if (base64Images != null) {
        for (const image of base64Images) {
          const base64Match = image.match(
            /src="(data:image\/[^;]+;base64[^"]+)"/,
          );
          if (base64Match) {
            const base64Data = base64Match[1];
            const buffer = Buffer.from(base64Data.split(',')[1], 'base64');
            const uploadResult = await this.uploadService.uploadImage(
              buffer,
              'blog',
            );

            updateBlogDto.content = updateBlogDto.content.replace(
              base64Data,
              uploadResult.url,
            );
          }
        }
      }
    }
    if (updateBlogDto.thumbnail) {
      const uploadThumbnail = await this.uploadService.uploadImage(
        file.buffer,
        'thumbnail',
      );
      updateBlogDto.thumbnail = uploadThumbnail.url;
    }

    await this.blogRepo.update({ id }, updateBlogDto);
    return await this.blogRepo.findOne({ where: { id } });
  }
}
