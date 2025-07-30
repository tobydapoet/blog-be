import { Inject, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { ILike, Repository } from 'typeorm';
import { ClientService } from 'src/client/client.service';
import { UploadCloundiaryService } from 'src/upload_cloundiary/upload_cloundiary.service';
import { RedisClientType } from 'redis';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private AccountRepo: Repository<Account>,
    private clientService: ClientService,
    private uploadService: UploadCloundiaryService,
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    const existing = await this.AccountRepo.findOne({
      where: { email: createAccountDto.email },
    });

    if (existing) {
      throw new Error('Email is exist!');
    }

    const user = this.AccountRepo.create(createAccountDto);
    const savedUser = await this.AccountRepo.save(user);

    await this.clientService.create({
      accountId: savedUser.id,
    });

    await this.redisClient.del(`account:all`);
    await this.redisClient.del(`account:${savedUser.id}`);

    return savedUser;
  }

  async findOne(id: string) {
    const cacheKey = `account:${id}`;

    const cached = await this.redisClient.get(cacheKey);
    if (cached) {
      console.log('Get from cache:', cached);
      return JSON.parse(cached);
    }

    const account = await this.AccountRepo.findOneBy({ id });
    if (account) {
      console.log('Get from db', account);

      await this.redisClient.set(cacheKey, JSON.stringify(account), {
        EX: 60 * 5,
      });
    }

    return account;
  }

  async findByEmail(email: string) {
    const cachedKey = `account-email:${email}`;
    const cached = await this.redisClient.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const account = await this.AccountRepo.findOne({ where: { email } });
    if (account) {
      await this.redisClient.set(cachedKey, JSON.stringify(account), {
        EX: 60 * 5,
      });
    }
    return account;
  }

  async findAll() {
    const cachedKey = `account:all`;
    const cached = await this.redisClient.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const accounts = await this.AccountRepo.find();

    await this.redisClient.set(cachedKey, JSON.stringify(accounts), {
      EX: 60 * 5,
    });
  }

  findMany(keyword: string) {
    return this.AccountRepo.find({
      where: [
        { email: ILike(`%${keyword}%`) },
        { name: ILike(`%${keyword}%`) },
      ],
    });
  }

  async update(
    id: string,
    updateAccountDto: Partial<UpdateAccountDto>,
    file?: Express.Multer.File,
  ) {
    const existing = await this.AccountRepo.findOne({
      where: { id },
    });

    if (!existing) {
      throw new Error('Email is not exist!');
    }

    if (file) {
      if (existing.avatar_url) {
        await this.uploadService.deleteImage(existing.avatar_url);
      }
      const uploadResult = await this.uploadService.uploadImage(
        file?.buffer,
        'account',
      );
      updateAccountDto.avatar_url = uploadResult.url;
    }

    await this.AccountRepo.update({ id }, updateAccountDto);

    const updatedAccount = await this.AccountRepo.findOne({ where: { id } });

    if (updatedAccount) {
      await this.redisClient.del(`account:all`);
      await this.redisClient.del(`account:${updatedAccount.id}`);
    }

    return updatedAccount;
  }

  async remove(id: string) {
    const existing = await this.AccountRepo.findOne({
      where: { id },
    });

    if (!existing) {
      throw new Error('Account is not exist!');
    }

    await this.redisClient.del(`account:all`);
    await this.redisClient.del(`account:${id}`);

    return await this.AccountRepo.update({ id }, { isDeleted: true });
  }
}
