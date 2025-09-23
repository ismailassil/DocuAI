import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  original_name: string;

  @Column()
  filename: string;

  @Column()
  summarized_filename: string;

  @Column({ type: 'boolean', default: false })
  is_summarized: boolean;

  @Column({ type: 'boolean', default: true })
  is_processing: boolean;

  @ManyToOne(() => User, (user) => user.files)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  reason?: string;

  constructor(file: Partial<File>) {
    Object.assign(this, file);
  }
}
