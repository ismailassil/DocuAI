import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AI_ROLES } from 'src/ai/entities/ai_role.enum';
import { MESSAGE_DTO } from 'src/ai/entities/message.dto';
import { Message } from 'src/ai/entities/message.entity';
import { RegisterDTO } from 'src/auth/entities/register.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
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

  async getUserMessages(userId: number): Promise<MESSAGE_DTO[] | null> {
    return await this.messageRepo.find({
      select: {
        role: true,
        message: true,
        createAt: true,
      },
      where: {
        userId: userId,
      },
      order: {
        createAt: 'ASC',
      },
    });
  }

  async getUserMessageContextByLimit(
    userId: number,
    limit: number = 10,
  ): Promise<Message[] | null> {
    return await this.messageRepo.find({
      where: {
        userId: userId,
        role: 'user',
      },
      order: {
        createAt: 'DESC',
      },
      take: limit,
    });
  }

  async registerMessage(
    userId: number,
    message: string,
    role: AI_ROLES,
  ): Promise<Message | null> {
    const newMessage = this.messageRepo.create({
      userId: userId,
      message: message,
      role: role,
    });

    return await this.messageRepo.save(newMessage);
  }

  saveFiles(userId: number, files: Express.Multer.File[]) {}
}
