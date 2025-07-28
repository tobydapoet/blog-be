import { Account } from 'src/account/entities/account.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('chat')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Account, (account) => account.senders, {
    eager: true,
    cascade: false,
  })
  @JoinColumn({ name: 'senderId' })
  sender: Account;

  @ManyToOne(() => Account, (account) => account.receivers, {
    eager: true,
    cascade: false,
  })
  @JoinColumn({ name: 'receiverId' })
  receiver: Account;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column('json', { nullable: true })
  images: string[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;
}
