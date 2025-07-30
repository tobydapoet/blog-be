import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { RedisClientType } from 'redis';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client) private clientRepo: Repository<Client>,
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
  ) {}

  async findAll() {
    const cachedKey = 'client:all';
    const cached = await this.redisClient.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const clients = await this.clientRepo.find();
    await this.redisClient.set(cachedKey, JSON.stringify(clients), {
      EX: 60 * 5,
    });
    return clients;
  }

  async findOne(id: number) {
    const cachedKey = `client:${id}`;
    const cached = await this.redisClient.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const client = await this.clientRepo.findOne({ where: { id } });
    if (client) {
      await this.redisClient.set(cachedKey, JSON.stringify(client), {
        EX: 60 * 5,
      });
    }
    return client;
  }

  async findByAccount(id: string) {
    const cachedKey = `client-account:${id}`;
    const cached = await this.redisClient.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const client = await this.clientRepo.findOne({
      where: { account: { id } },
    });
    if (client) {
      await this.redisClient.set(cachedKey, JSON.stringify(client), {
        EX: 60 * 5,
      });
    }
    return client;
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
    const savedClient = await this.clientRepo.save(client);
    await this.redisClient.del(`client:all`);
    return savedClient;
  }

  async update(id: string, updateClientDto: Partial<UpdateClientDto>) {
    await this.clientRepo.update({ account: { id } }, updateClientDto);
    const savedClient = await this.clientRepo.findOne({
      where: { account: { id } },
    });
    await this.redisClient.del(`client:all`);
    await this.redisClient.del(`client:${id}`);
    await this.redisClient.del(`client:${savedClient?.account.id}`);
    return savedClient;
  }
}
