import { Inject, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Like, Repository } from 'typeorm';
import { UploadCloundiaryService } from 'src/upload_cloundiary/upload_cloundiary.service';
import { RedisClientType } from 'redis';
import { CategoryService } from 'src/category/category.service';
import { StatusType } from './types/status';
import { FollowingService } from 'src/following/following.service';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationType } from 'src/notification/types/notification';
import { ClientService } from 'src/client/client.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private blogRepo: Repository<Blog>,
    private uploadService: UploadCloundiaryService,
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private followingService: FollowingService,
    private clientService: ClientService,
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
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

    const client = await this.clientService.findOne(createBlogDto.clientId);

    if (!client) throw new Error('Client not found');

    const blog = this.blogRepo.create({
      ...createBlogDto,
      client: { id: createBlogDto.clientId },
    });
    const savedBlog = await this.blogRepo.save(blog);

    if (savedBlog) {
      {
        const categories = await this.categoryService.findByBlog(savedBlog.id);
        await this.redisClient.del('blog:all');
        for (const category of categories) {
          await this.redisClient.del(`blog-category:${category.name}`);
        }
        await this.redisClient.del(`blog-client:${savedBlog.client}`);
        const notifyFollowing = await this.followingService.findByFollowed(
          createBlogDto.clientId,
        );
        if (notifyFollowing) {
          for (const followers of notifyFollowing) {
            await this.notificationService.create({
              clientId: followers.follower.id,
              message: `${client.account.name} Just upload new blog!`,
              refId: savedBlog.id,
              type: NotificationType.NEWBLOG,
            });
          }
        }
      }
    }
    return savedBlog;
  }

  async findAll() {
    const cacheKey = 'blog:all';

    const cached = await this.redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const blogs = await this.blogRepo.find();

    await this.redisClient.set(cacheKey, JSON.stringify(blogs), {
      EX: 60 * 5,
    });

    return blogs;
  }

  async findOne(id: number) {
    return this.blogRepo.findOne({ where: { id } });
  }

  async findByClient(id: number) {
    const cachedKey = `blog-client:${id}`;
    const cached = await this.redisClient.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const blogs = await this.blogRepo.find({ where: { client: { id } } });
    if (blogs) {
      await this.redisClient.set(cachedKey, JSON.stringify(blogs), {
        EX: 60 * 5,
      });
    }
    return blogs;
  }

  findMany(keyword: string) {
    return this.blogRepo.find({
      where: [
        { title: Like(`%${keyword}%`) },
        { client: { account: { name: Like(`%${keyword}%`) } } },
      ],
    });
  }

  async findByCategory(category: string) {
    const cachedKey = `blog-category:${category}`;
    const cached = await this.redisClient.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const blogs = this.blogRepo.find({
      where: { blog_categories: { category: { name: category } } },
    });

    if (blogs) {
      await this.redisClient.set(cachedKey, JSON.stringify(blogs), {
        EX: 60 * 5,
      });
    }
    return blogs;
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

    const updatedBlog = await this.blogRepo.findOne({ where: { id } });
    if (updatedBlog) {
      {
        const categories = await this.categoryService.findByBlog(id);
        await this.redisClient.del('blog:all');
        for (const category of categories) {
          await this.redisClient.del(`blog-category:${category.name}`);
        }
        await this.redisClient.del(`blog-client:${updatedBlog.client}`);
      }
    }
    return updatedBlog;
  }

  async updateStatus(id: number, status: number) {
    const blog = await this.blogRepo.findOne({ where: { id } });
    if (!blog) throw new Error('Post not found');
    let statusString = StatusType.WAIT;
    if (status === 0) {
      statusString = StatusType.WAIT;
    } else if (status === 1) {
      statusString = StatusType.APPROVED;
    } else if (status === 2) {
      statusString = StatusType.DENIED;
    } else {
      throw new Error('wrong status!');
    }
    await this.blogRepo.update({ id }, { status: statusString });
    const updatedPost = await this.blogRepo.findOne({ where: { id } });
    if (updatedPost) {
      await this.redisClient.del(`blog:all`);
      await this.redisClient.del(`blog-client:${id}`);
    }
    return updatedPost;
  }
}
