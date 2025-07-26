import { Account } from 'src/account/entities/account.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('refresh_token')
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Account, (account) => account.refreshTokens, {
    eager: true,
    cascade: true,
  })
  account: Account;

  @Column({ type: 'text' })
  hashedToken: string;

  @CreateDateColumn()
  createdAt: Date;
}
