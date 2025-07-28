import { Chat } from 'src/chat/entities/chat.entity';
import { Client } from 'src/client/entities/client.entity';
import { Staff } from 'src/staff/entities/staff.entity';
import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RefreshToken } from 'src/refresh_token/entities/refresh_token.entity';
import { Role } from 'src/auth/enums/role.enum';

@Entity('account')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false, unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  avatar_url: string;

  @Column({ type: 'text', nullable: true })
  password: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CLIENT,
  })
  role: Role;

  @Column({ type: 'text', nullable: true })
  google_id: string;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => Client, (client) => client.account, {
    eager: true,
    cascade: true,
  })
  client: Client;

  @OneToOne(() => Staff, (staff) => staff.account, {
    eager: true,
    cascade: true,
  })
  staff: Staff;

  @OneToMany(() => Chat, (chat) => chat.sender)
  senders: Chat[];

  @OneToMany(() => Chat, (chat) => chat.receiver)
  receivers: Chat[];

  @OneToMany(() => RefreshToken, (token) => token.account)
  refreshTokens: RefreshToken[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
