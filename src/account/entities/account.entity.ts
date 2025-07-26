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
  PrimaryColumn,
} from 'typeorm';
import { RefreshToken } from 'src/refresh_token/entities/refresh_token.entity';
import { Role } from 'src/auth/enums/role.enum';

@Entity('account')
export class Account {
  @PrimaryColumn({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({ type: 'text' })
  avatar_url: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CLIENT,
  })
  role: Role;

  @Column({ type: 'text' })
  google_id: string;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => Client, (client) => client.account)
  client: Client;

  @OneToOne(() => Staff, (staff) => staff.account)
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
