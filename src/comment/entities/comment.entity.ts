import { Client } from 'src/client/entities/client.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  commentTableId: number;

  @Column({
    type: 'enum',
    enum: ['comment', 'blog', 'post'],
    nullable: false,
  })
  commentTableType: 'comment' | 'blog' | 'post';

  @ManyToOne(() => Client, (client) => client.comments, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ type: 'text', nullable: false })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;
}
