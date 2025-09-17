import { Message } from 'src/ai/entities/message.entity';
import { File } from './file.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Message, (message) => message.user)
  messages: string[];

  @OneToMany(() => File, (file) => file.user)
  files: string[];
}
