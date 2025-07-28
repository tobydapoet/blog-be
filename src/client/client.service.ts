import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client) private clientRepo: Repository<Client>,
  ) {}

  async findAll() {
    return await this.clientRepo.find();
  }

  async findOne(id: number) {
    return await this.clientRepo.findOne({ where: { id } });
  }

  async findByAccount(id: string) {
    return await this.clientRepo.findOne({ where: { account: { id } } });
  }

  async create(createClientDto: CreateClientDto) {
    const existing = await this.clientRepo.findOne({
      where: { account: { id: createClientDto.accountId } },
    });
    if (existing) {
      throw new Error('account is already in server');
    }
    const { accountId, ...rest } = createClientDto;
    const client = this.clientRepo.create({
      ...rest,
      account: { id: accountId },
    });
    return await this.clientRepo.save(client);
  }

  async update(id: string, updateClientDto: Partial<UpdateClientDto>) {
    return await this.clientRepo.update({ account: { id } }, updateClientDto);
  }
}
