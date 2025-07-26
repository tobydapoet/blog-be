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

  @OneToOne(() => Account, (account) => account.staff, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'email' })
  account: Account;

  @Column({ type: 'text', nullable: false })
  phone: string;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;
}
