import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  original_name: string;

  @Column()
  filename: string;

  @ManyToOne(() => User, (user) => user.files)
  user: User;
}
