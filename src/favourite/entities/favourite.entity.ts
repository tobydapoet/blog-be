import { Client } from 'src/client/entities/client.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FavouriteTableType } from '../types/favouriteTableType';

@Entity('favourite')
export class Favourite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  favouriteTableId: number;

  @Column({ type: 'enum', enum: FavouriteTableType, nullable: false })
  favouriteTableType: FavouriteTableType;

  @ManyToOne(() => Client, (client) => client.favourites, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'clientId' })
  client: Client;
}
