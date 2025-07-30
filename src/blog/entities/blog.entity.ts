import { BlogCategory } from 'src/blog_category/entities/blog_category.entity';
import { Client } from 'src/client/entities/client.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StatusType } from '../types/status';

@Entity('blog')
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, (client) => client.blogs, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column({ type: 'text', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'text', nullable: false })
  thumbnail: string;

  @Column({ type: 'enum', enum: StatusType, default: StatusType.WAIT })
  status: StatusType;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @OneToMany(() => BlogCategory, (blogCategory) => blogCategory.blog)
  blog_categories: BlogCategory[];
}
