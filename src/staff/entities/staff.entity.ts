import { Account } from 'src/account/entities/account.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Account, (account) => account.staff)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column({ type: 'text', nullable: false })
  phone: string;
}
