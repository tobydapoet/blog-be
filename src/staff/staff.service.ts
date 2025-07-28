import { Injectable } from '@nestjs/common';
import { Staff } from './entities/staff.entity';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class StaffService {
  constructor(@InjectRepository(Staff) private staffRepo: Repository<Staff>) {}

  async findAll() {
    return await this.staffRepo.find();
  }

  async findOne(id: number) {
    return await this.staffRepo.findOne({ where: { id } });
  }

  async findByAccount(id: string) {
    return await this.staffRepo.findOne({ where: { account: { id } } });
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

    return await this.staffRepo.save(staff);
  }

  async update(id: string, updateClientDto: Partial<UpdateStaffDto>) {
    return await this.staffRepo.update({ account: { id } }, updateClientDto);
  }
}
