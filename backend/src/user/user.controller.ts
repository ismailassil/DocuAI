import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DatabaseService } from 'src/database/database.service';
import { UserService } from './user.service';
import { AIService } from 'src/ai/ai.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import type { Cache } from 'cache-manager';
import type { Request, Response } from 'express';
import type { EXTRACTED_JWT_PAYLOAD } from 'src/auth/entities/jwt.payload';
import { FileDTO } from './entities/file.dto';
import { createReadStream } from 'fs';
import { join } from 'path';
import fs from 'fs';
import { GET_FILES_DTO } from './entities/getfiles.dto';
import { SEARCH_DTO } from './entities/search.dto';

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
    FileFieldsInterceptor([{ name: 'docs', maxCount: 5 }], {
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
        fileSize: 1024 * 1024 * 3,
      },
    }),
  )
  async uploadFile(
    @Req() req: Request,
    @UploadedFiles() files: { docs?: Express.Multer.File[] },
  ) {
    const userExt = req['user'] as EXTRACTED_JWT_PAYLOAD;

    if (!files || !files['docs'])
      throw new NotFoundException('No Docs Has Arrived');

    const filesInfo = await this.userService.filterAndSaveFiles(
      files['docs'],
      userExt.sub,
    );

    void this.userService.analyzeFiles(filesInfo);

    return { message: 'Files Uploaded and Summarized Successfully' };
  }

  @Get('recent-files')
  async getRecentFiles(@Req() req: Request) {
    const user = req['user'] as EXTRACTED_JWT_PAYLOAD;

    const filesInfo = await this.databaseService.getUserFiles(user.sub, 4, 0);
    if (!filesInfo || filesInfo.length === 0) {
      throw new NotFoundException('No Files Found');
    }

    return filesInfo.map((file) => new FileDTO(file));
  }

  @Get('files')
  async getFiles(
    @Req() req: Request,
    @Query(new ValidationPipe({ transform: true })) { page }: GET_FILES_DTO,
  ) {
    const user = req['user'] as EXTRACTED_JWT_PAYLOAD;

    const take = 7;
    const skip = (page - 1) * 7;

    const filesInfo = await this.databaseService.getUserFiles(
      user.sub,
      take,
      skip,
    );
    if (!filesInfo || filesInfo.length === 0) {
      throw new NotFoundException('No Files Found');
    }

    return {
      files: filesInfo.map(
        (file) => new FileDTO(file, file.summarized_filename),
      ),
    };
  }

  @Get('file/:id')
  async getFile(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const user = req['user'] as EXTRACTED_JWT_PAYLOAD;
    const fileInfo = await this.userService.isValidFileOwnership(id, user.sub);

    const path = join(
      __dirname,
      '../../uploads/' + fileInfo.summarized_filename,
    );
    if (!fs.existsSync(path)) {
      throw new NotFoundException('File no longer exists');
    }

    const info = fs.statSync(path);

    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Length', info.size);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="sum-${fileInfo.original_name}.md"`,
    );

    const fileStream = createReadStream(path);
    fileStream.on('error', (err) => {
      console.error('Error while Streaming', err);
      res.status(500).end('Error reading file');
    });

    fileStream.pipe(res);
  }

  @Get('search')
  async getSearchedQuery(@Req() req: Request, @Query() { value }: SEARCH_DTO) {
    const user = req['user'] as EXTRACTED_JWT_PAYLOAD;

    const files = await this.userService.searchByName(value, user.sub);

    if (files.length > 0) {
      return files.map((file) => new FileDTO(file, file.original_name));
    }

    return files;
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

    response.send({ success: true });
  }
}
