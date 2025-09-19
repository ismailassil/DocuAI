import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DatabaseService } from 'src/database/database.service';
import { UserService } from './user.service';
import { AIService } from 'src/ai/ai.service';
import { FileInfo } from './entities/file_info.type';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import type { Cache } from 'cache-manager';
import type { Request, Response } from 'express';
import { JWT_PAYLOAD } from 'src/auth/entities/jwt.payload';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
    private readonly aiService: AIService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 5 }], {
      storage: diskStorage({
        destination: './uploads',
        filename: function (_, file, cb) {
          cb(
            null,
            file.originalname + '-' + Date.now().toString() + file.originalname,
          );
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 10,
      },
    }),
  )
  async uploadFile(@UploadedFiles() files: { files?: Express.Multer.File[] }) {
    if (files && files['files']) {
      console.log(files['files']);
      // TODO - register the filename + the originalname of the file into DB
      const filesInfo = await this.userService.filterAndSaveFiles(
        files['files'],
      );

      const errorFiles: { info: FileInfo; error: string }[] = [];

      for (const file of filesInfo) {
        try {
          // TODO - Upload the file into deepseek for analyzing and getting new file summarized
          const response = await this.aiService.analyzeDocs(file);

          const content = response.choices[0].message.content;
          if (!content) throw new Error('Empty Summarized Content');

          this.userService.generateSummarizedFile(content, file);
        } catch (error) {
          errorFiles.push({ info: file, error: (error as Error).message });
        }
      }
    }

    return { message: 'Files Uploaded and Summarized Successfully' };
  }

  @Get('recent-files')
  async getRecentFiles(@Req() req: Request) {
    const user = req['user'] as JWT_PAYLOAD;

    const filesInfo = await this.databaseService.getUserFiles(user.sub, 5, 0);
    if (!filesInfo || filesInfo.length === 0) {
      throw new NotFoundException('No Files Found');
    }

    return filesInfo;
  }

  @Post('logout')
  @HttpCode(HttpStatus.CREATED)
  async logout(@Req() request: Request, @Res() response: Response) {
    const token: string = request['token'] as string;
    const refreshToken = request.cookies['refresh_token'] as string;

    const tokenInfo = await this.databaseService.getTokenInfo(refreshToken);

    if (tokenInfo) {
      await this.databaseService.updateTokenInfo({
        ...tokenInfo,
        is_used: true,
      });
    }

    await this.cacheManager.set(`blacklist:${token}`, 'isBlacklisted');
    response.clearCookie('refresh_token');

    return { success: true };
  }
}
