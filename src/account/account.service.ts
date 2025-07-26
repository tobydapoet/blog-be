import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { Client } from 'src/client/entities/client.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private AccountRepo: Repository<Account>,
    @InjectRepository(Client) private ClientRepo: Repository<Client>,
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

    const client = this.ClientRepo.create({
      account: savedUser,
    });

    await this.ClientRepo.save(client);

    return savedUser;
  }

  async findByEmail(email: string) {
    return await this.AccountRepo.findOne({
      where: {
        email,
      },
    });
  }

  findAll() {
    return `This action returns all account`;
  }

  findOne(email: string) {
    return `This action returns a #${email} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
