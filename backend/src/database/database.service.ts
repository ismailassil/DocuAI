import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDTO } from 'src/auth/entities/register.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  getUserById(id: number): Promise<User | null> {
    return this.userRepo.findOneBy({
      id: id,
    });
  }

  getUserByUsername(username: string): Promise<User | null> {
    return this.userRepo.findOneBy({
      username: username,
    });
  }

  findUserByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<User | null> {
    return this.userRepo.findOne({
      where: [{ username: username }, { email: email }],
    });
  }

  async createUser(
    registerDto: RegisterDTO,
    password: string,
  ): Promise<User | null> {
    const newUser = this.userRepo.create({
      username: registerDto.username,
      email: registerDto.email,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      password: password,
    });

    return await this.userRepo.save(newUser);
  }
}
