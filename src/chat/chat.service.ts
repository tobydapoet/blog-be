import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { AccountService } from 'src/account/account.service';
import { Account } from 'src/account/entities/account.entity';
import { UploadCloundiaryService } from 'src/upload_cloundiary/upload_cloundiary.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepo: Repository<Chat>,
    private accountService: AccountService,
    private uploadService: UploadCloundiaryService,
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

    return Array.from(map.values());
  }

  async update(id: number, updateChatDto: UpdateChatDto) {
    return this.chatRepo.update({ id }, updateChatDto);
  }
}
