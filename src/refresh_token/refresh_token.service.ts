import { Injectable } from '@nestjs/common';
import { CreateRefreshTokenDto } from './dto/create-refresh_token.dto';
import { UpdateRefreshTokenDto } from './dto/update-refresh_token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh_token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
  ) {}
  create(createRefreshTokenDto: CreateRefreshTokenDto) {
    return 'This action adds a new refreshToken';
  }

  findAll() {
    return `This action returns all refreshToken`;
  }

  async createHashedRefreshToken(email: string, hashedToken: string) {
    const token = this.refreshTokenRepo.create({
      account: { email },
      hashedToken,
    });
    return await this.refreshTokenRepo.save(token);
  }

  async deleteHashedRefreshToken(id: number) {
    return await this.refreshTokenRepo.delete({ id });
  }

  async findOneByTokenAndEmail(email: string, token: string) {
    return await this.refreshTokenRepo.findOne({
      where: { account: { email }, hashedToken: token },
    });
  }

  update(id: number, updateRefreshTokenDto: UpdateRefreshTokenDto) {
    return `This action updates a #${id} refreshToken`;
  }

  remove(id: number) {
    return `This action removes a #${id} refreshToken`;
  }
}
