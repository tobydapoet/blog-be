import { Client } from 'src/client/entities/client.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, (client) => client.notifications, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({
    type: 'enum',
    enum: [
      'new_blog',
      'new_post',
      `like_blog`,
      'like_post',
      'comment_response',
    ],
    nullable: false,
  })
  type:
    | 'new_blog'
    | 'new_post'
    | `like_blog`
    | 'like_post'
    | 'comment_response';

  @Column({ type: 'int', nullable: true })
  refId: number;

  @Column({ type: 'text', nullable: true })
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
