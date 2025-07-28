import { Client } from 'src/client/entities/client.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('following')
export class Following {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, (client) => client.followers, {
    eager: true,
    cascade: false,
  })
  @JoinColumn({ name: 'clientId' })
  follower: Client;

  @ManyToOne(() => Client, (client) => client.followed, {
    eager: true,
    cascade: false,
  })
  @JoinColumn({ name: 'followedId' })
  followed: Client;
}
