import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh_token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
  ) {}

  async createHashedRefreshToken(id: string, hashedToken: string) {
    const token = this.refreshTokenRepo.create({
      account: { id },
      hashedToken,
    });
    return await this.refreshTokenRepo.save(token);
  }

  async deleteHashedRefreshToken(id: number) {
    return await this.refreshTokenRepo.delete({ id });
  }

  async findOneByTokenAndAccount(id: string, token: string) {
    return await this.refreshTokenRepo.findOne({
      where: { account: { id }, hashedToken: token },
    });
  }
}
