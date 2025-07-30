import { Client } from 'src/client/entities/client.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NotificationType } from '../types/notification';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, (client) => client.notifications, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column({ type: 'enum', enum: NotificationType, nullable: false })
  type: NotificationType;

  @Column({ type: 'int', nullable: true })
  refId: number;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
