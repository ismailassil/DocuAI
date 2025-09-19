import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  value: string;

  @Column({ default: false })
  is_used: boolean;

  @ManyToOne(() => User, (user) => user.tokens)
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  expiresAt: Date;

  constructor(token: Partial<Token>) {
    Object.assign(this, token);
  }
}
