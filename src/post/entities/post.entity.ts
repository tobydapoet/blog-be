import { Client } from 'src/client/entities/client.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('post')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, (client) => client.posts, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  images: string[];
}
