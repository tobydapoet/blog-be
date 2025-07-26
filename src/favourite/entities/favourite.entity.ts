import { Client } from 'src/client/entities/client.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('favourite')
export class Favourite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  favouriteTableId: number;

  @Column({ type: 'enum', enum: ['comment', 'blog', 'post'], nullable: false })
  favouriteTableType: 'comment' | 'blog' | 'post';

  @ManyToOne(() => Client, (client) => client.favourites, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'client_id' })
  client: Client;
}
