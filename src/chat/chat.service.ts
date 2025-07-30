import { Inject, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { UploadCloundiaryService } from 'src/upload_cloundiary/upload_cloundiary.service';
import { RedisClientType } from 'redis';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepo: Repository<Chat>,
    private uploadService: UploadCloundiaryService,
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
  ) {}

  async create(createChatDto: CreateChatDto, files?: Express.Multer.File[]) {
    if (!files && !createChatDto.content) {
      throw new Error('Content cannot be empty!');
    }
    const imagesList: string[] = [];

    if (files) {
      for (const file of files) {
        const image = await this.uploadService.uploadImage(file.buffer, 'chat');
        if (image) {
          imagesList.push(image.url);
        }
      }
      createChatDto.images = imagesList;
    }

    const { receiver, sender, ...res } = createChatDto;

    const chat = this.chatRepo.create({
      receiver: { id: receiver },
      sender: { id: sender },
      ...res,
    });

    await this.redisClient.del(`chat:${sender}`);
    await this.redisClient.del(`chat:${receiver}`);

    return await this.chatRepo.save(chat);
  }

  async getChatBetweenTwoUsers(user1: string, user2: string) {
    return this.chatRepo.find({
      where: [
        {
          sender: { id: user1 },
          receiver: { id: user2 },
        },
        {
          sender: { id: user2 },
          receiver: { id: user1 },
        },
      ],
      order: { createdAt: 'ASC' },
    });
  }

  async getAllConversations(userId: string) {
    const cachedKey = `chat:${userId}`;
    const cached = await this.redisClient.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const chats = await this.chatRepo
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.sender', 'sender')
      .leftJoinAndSelect('chat.receiver', 'receiver')
      .where('sender.id = :userId OR receiver.id = :userId', { userId })
      .orderBy('chat.createdAt', 'DESC')
      .getMany();

    const map = new Map<string, (typeof chats)[0]>();

    for (const chat of chats) {
      const senderId = chat.sender.id;
      const receiverId = chat.receiver.id;

      const key = [senderId, receiverId].sort().join('_');

      if (!map.has(key)) {
        map.set(key, chat);
      }
    }
    const result = Array.from(map.values());

    await this.redisClient.set(cachedKey, JSON.stringify(result), {
      EX: 300,
    });

    return result;
  }

  async update(id: number, updateChatDto: UpdateChatDto) {
    await this.chatRepo.update({ id }, updateChatDto);

    const chat = await this.chatRepo.findOne({
      where: { id },
    });

    if (chat) {
      const senderId = chat.sender.id;
      const receiverId = chat.receiver.id;
      await this.redisClient.del(`chat:${senderId}`);
      await this.redisClient.del(`chat:${receiverId}`);
    }

    return chat;
  }
}
