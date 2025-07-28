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
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column('json', { nullable: true })
  images: string[];

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;
}
