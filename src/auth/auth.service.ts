import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { AccountService } from 'src/account/account.service';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { RefreshToken } from 'src/refresh_token/entities/refresh_token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountDto } from 'src/account/dto/create-account.dto';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshConfiguration: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.accountService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found!');
    }
    const isPasswordMatch = await compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Incorrect password!');
    }

    return { email: user.email };
  }

  async login(email: string) {
    const account = await this.accountService.findByEmail(email);
    if (!account) {
      throw new UnauthorizedException("Can't find this account");
    }
    const session = this.refreshTokenRepo.create({
      account: account,
      hashedToken: '',
    });
    const savedSession = await this.refreshTokenRepo.save(session);

    const payload: AuthJwtPayload = {
      sub: savedSession.id,
      role: savedSession.account.role,
      email,
    };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshConfiguration),
    ]);

    const hashedRefreshToken = await argon2.hash(refresh_token);

    savedSession.hashedToken = hashedRefreshToken;
    await this.refreshTokenRepo.save(savedSession);

    return {
      access_token,
      refresh_token,
    };
  }

  async refreshToken(sessionId: number) {
    const session = await this.refreshTokenRepo.findOne({
      where: { id: sessionId },
    });
    if (!session) {
      throw new UnauthorizedException();
    }
    const payload: AuthJwtPayload = {
      sub: session.id,
      email: session.account.email,
      role: session.account.role,
    };

    const access_token = this.jwtService.sign(payload);
    return access_token;
  }

  async validateRefreshToken(id: number, refresh_token: string) {
    const session = await this.refreshTokenRepo.findOne({ where: { id } });

    if (!session || !session.hashedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isMatch = await argon2.verify(session.hashedToken, refresh_token);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return session.account;
  }

  async logout(id: number) {
    return await this.refreshTokenRepo.delete({ id });
  }

  async validateJwt(sessionId: number): Promise<AuthJwtPayload> {
    const session = await this.refreshTokenRepo.findOne({
      where: { id: sessionId },
      relations: { account: true },
    });

    if (!session || !session.account) {
      throw new UnauthorizedException('Session or account not found!');
    }

    return {
      sub: session.id,
      email: session.account.email,
      role: session.account.role,
    };
  }

  async validateGoogleAccount(googleAcount: CreateAccountDto) {
    const acount = await this.accountService.findByEmail(googleAcount.email);
    if (acount) return acount;
    return await this.accountService.create(googleAcount);
  }
}
