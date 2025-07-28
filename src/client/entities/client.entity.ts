import { Account } from 'src/account/entities/account.entity';
import { Blog } from 'src/blog/entities/blog.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Favourite } from 'src/favourite/entities/favourite.entity';
import { Following } from 'src/following/entities/following.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { Post } from 'src/post/entities/post.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('client')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Account, (account) => account.client)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column({ type: 'text' })
  bio: string;

  @Column({ type: 'text' })
  facebook_link: string;

  @Column({ type: 'text' })
  instagram_link: string;

  @Column({ type: 'text' })
  website_link: string;

  @Column({ type: 'datetime', nullable: true })
  birth: Date;

  @OneToMany(() => Blog, (blog) => blog.id)
  blogs: Blog[];

  @OneToMany(() => Post, (post) => post.id)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.client)
  comments: Comment[];

  @OneToMany(() => Favourite, (favourite) => favourite.client)
  favourites: Favourite[];

  @OneToMany(() => Following, (following) => following.follower)
  followers: Following[];

  @OneToMany(() => Following, (following) => following.followed)
  followed: Following[];

  @OneToMany(() => Notification, (notification) => notification.client)
  notifications: Notification[];
}
