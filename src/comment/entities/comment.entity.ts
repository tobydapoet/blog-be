import { Client } from 'src/client/entities/client.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommentTableType } from '../types/commentTableType';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  commentTableId: number;

  @Column({
    type: 'enum',
    enum: CommentTableType,
    nullable: false,
  })
  commentTableType: CommentTableType;

  @ManyToOne(() => Client, (client) => client.comments, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column({ type: 'text', nullable: false })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;
}
