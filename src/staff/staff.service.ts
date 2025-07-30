import { Inject, Injectable } from '@nestjs/common';
import { Staff } from './entities/staff.entity';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { RedisClientType } from 'redis';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff) private staffRepo: Repository<Staff>,
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
  ) {}

  async findAll() {
    const cachedKey = 'staff:all';
    const cached = await this.redisClient.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const staffs = await this.staffRepo.find();
    await this.redisClient.set(cachedKey, JSON.stringify(staffs), {
      EX: 60 * 5,
    });
    return staffs;
  }

  async findOne(id: number) {
    const cachedKey = `staff:${id}`;
    const cached = await this.redisClient.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const staff = await this.staffRepo.findOne({ where: { id } });
    if (staff) {
      await this.redisClient.set(cachedKey, JSON.stringify(staff), {
        EX: 60 * 5,
      });
    }
    return staff;
  }

  async findByAccount(id: string) {
    const cachedKey = `staff-account:${id}`;
    const cached = await this.redisClient.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const staff = await this.staffRepo.findOne({ where: { account: { id } } });
    if (staff) {
      await this.redisClient.set(cachedKey, JSON.stringify(staff), {
        EX: 60 * 5,
      });
    }
    return staff;
  }

  async create(createStaffDto: CreateStaffDto) {
    const existing = await this.staffRepo.findOne({
      where: { account: { id: createStaffDto.accountId } },
    });
    if (existing) {
      throw new Error('already have this staff!');
    }
    const { accountId, ...rest } = createStaffDto;

    const staff = this.staffRepo.create({
      ...rest,
      account: { id: accountId },
    });

    const savedStaff = await this.staffRepo.save(staff);
    await this.redisClient.del(`staff:all`);

    return savedStaff;
  }

  async update(id: string, updateStaffDto: Partial<UpdateStaffDto>) {
    await this.staffRepo.update({ account: { id } }, updateStaffDto);
    const savedClient = await this.staffRepo.findOne({
      where: { account: { id } },
    });
    await this.redisClient.del(`staff:all`);
    await this.redisClient.del(`staff:${id}`);
    await this.redisClient.del(`staff:${savedClient?.account.id}`);
    return savedClient;
  }
}
