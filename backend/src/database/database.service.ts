import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AI_ROLES } from 'src/ai/entities/ai_role.enum';
import { MESSAGE_DTO } from 'src/ai/entities/message.dto';
import { Message } from 'src/ai/entities/message.entity';
import { RegisterDTO } from 'src/auth/entities/register.dto';
import { File } from 'src/user/entities/file.entity';
import { FileInfo } from 'src/user/entities/file_info.type';
import { Token } from 'src/user/entities/tokens.entity';
import { User } from 'src/user/entities/user.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(File)
    private readonly fileRepo: Repository<File>,
    @InjectRepository(Token)
    private readonly tokenRepo: Repository<Token>,
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

  getUserByEmail(email: string) {
    return this.userRepo.findOne({
      where: { email: email },
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
    user: User,
    message: string,
    role: AI_ROLES,
  ): Promise<Message | null> {
    const newMessage = this.messageRepo.create({
      user,
      message: message,
      role: role,
    });

    return await this.messageRepo.save(newMessage);
  }

  async saveFiles(files: Partial<File>[]) {
    return await this.fileRepo.insert(files);
  }

  async getTokenInfo(token: string) {
    return await this.tokenRepo.findOne({
      where: {
        value: token,
      },
      relations: {
        user: true,
      },
    });
  }

  async updateTokenInfo(token: Token) {
    return await this.tokenRepo.save(token);
  }

  async registerRefreshToken(userInfo: User, token: string) {
    const currentDate = new Date();
    const daysToAdd = 7;
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + daysToAdd);

    const newToken = new Token({
      user: userInfo,
      value: token,
      expiresAt: futureDate,
    });

    // Delete previous token
    await this.tokenRepo.delete({
      user: {
        id: userInfo.id,
      },
    });

    const entity = this.tokenRepo.create(newToken);

    const savedToken = await this.tokenRepo.save(entity);
    console.log('----------------------------------------');
    console.log('---------------------------------------- REGISTRATION');
    console.log(savedToken);
    console.log('----------------------------------------');
    console.log('----------------------------------------');

    return savedToken;
  }

  async getUserFiles(userId: number, max: number, skip: number) {
    return await this.fileRepo.find({
      where: {
        user_id: userId,
      },
      take: max,
      skip: skip,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getUserFileById(userId: number, fileId: number) {
    return await this.fileRepo.findOne({
      where: {
        id: fileId,
        user_id: userId,
      },
    });
  }

  async updateFiles(file: FileInfo, is_summarized: boolean = true) {
    return await this.fileRepo.update(
      { filename: file.name },
      { is_summarized: is_summarized, is_processing: false },
    );
  }

  async getUserRelatedFilesByName(name: string, userId: number) {
    return await this.fileRepo.findBy({
      original_name: ILike(`%${name}%`),
      user_id: userId,
    });
  }
}
