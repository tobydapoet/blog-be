import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { ILike, Repository } from 'typeorm';
import { ClientService } from 'src/client/client.service';
import { UploadCloundiaryService } from 'src/upload_cloundiary/upload_cloundiary.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private AccountRepo: Repository<Account>,
    private clientService: ClientService,
    private uploadService: UploadCloundiaryService,
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

    return savedUser;
  }

  async findOne(id: string) {
    return await this.AccountRepo.findOne({ where: { id } });
  }

  async findByEmail(email: string) {
    return await this.AccountRepo.findOne({ where: { email } });
  }

  findAll() {
    return this.AccountRepo.find();
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

    return updatedAccount;
  }

  async remove(id: string) {
    const existing = await this.AccountRepo.findOne({
      where: { id },
    });

    if (!existing) {
      throw new Error('Account is not exist!');
    }

    return await this.AccountRepo.update({ id }, { isDeleted: true });
  }
}
