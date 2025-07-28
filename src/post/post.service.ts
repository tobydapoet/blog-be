import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { UploadCloundiaryService } from 'src/upload_cloundiary/upload_cloundiary.service';
import { ClientService } from 'src/client/client.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    private uploadService: UploadCloundiaryService,
    private clientService: ClientService,
  ) {}
  async create(createPostDto: CreatePostDto, files?: Express.Multer.File[]) {
    if (files?.length === 0 && !createPostDto.content) {
      throw new Error('Content can not be empty!');
    }
    const imagesList: string[] = [];
    if (files) {
      for (const file of files) {
        const imageUpload = await this.uploadService.uploadImage(
          file.buffer,
          'post',
        );
        imagesList.push(imageUpload.url);
      }
      createPostDto.images = imagesList;
    }

    const { clientId } = createPostDto;

    const client = await this.clientService.findOne(clientId);
    if (!client) throw new Error('Client not found');

    const post = this.postRepo.create({
      ...createPostDto,
      client,
    });

    return await this.postRepo.save(post);
  }

  findAll() {
    return this.postRepo.find();
  }

  findOne(id: number) {
    return this.postRepo.findOne({ where: { id } });
  }

  findByClient(id: number) {
    return this.postRepo.find({ where: { client: { id } } });
  }

  findMany(keyword: string) {
    return this.postRepo.find({
      where: [{ content: keyword }, { client: { account: { name: keyword } } }],
    });
  }

  async update(
    id: number,
    updatePostDto: Partial<UpdatePostDto>,
    files?: Express.Multer.File[],
  ) {
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) throw new Error('Post not found');
    const imagesList: string[] = post.images || [];
    if (files) {
      for (const file of files) {
        const imageUpload = await this.uploadService.uploadImage(
          file.buffer,
          'post',
        );
        imagesList.push(imageUpload.url);
      }
      updatePostDto.images = imagesList;
    }
    await this.postRepo.update({ id }, updatePostDto);
    return await this.postRepo.findOne({ where: { id } });
  }
}
