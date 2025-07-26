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
    cascade: true,
  })
  @JoinColumn({ name: 'sender_id' })
  sender: Account;

  @ManyToOne(() => Account, (account) => account.receivers, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'receiver_id' })
  receiver: Account;

  @Column({ type: 'text', nullable: false })
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
