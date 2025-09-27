import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { File } from './entities/file.entity';
import { FileInfo } from './entities/file_info.type';
import { AIService } from 'src/ai/ai.service';
import { MinIoService } from 'src/min-io/min-io.service';

@Injectable()
export class UserService {
  private readonly logger: Logger;

  constructor(
    private databaseService: DatabaseService,
    private aiService: AIService,
    private minIOService: MinIoService,
  ) {
    this.logger = new Logger('UserService');
  }

  async filterAndSaveFiles(files: Express.Multer.File[], userId: number) {
    const dbFiles: File[] = [];
    const user = await this.databaseService.getUserById(userId);
    const filesInfo: FileInfo[] = [];

    if (!user) throw new NotFoundException('User Not Found');

    for (const file of files) {
      const { filename } = await this.minIOService.uploadFile(file);

      const newFile = new File({
        original_name: file.originalname,
        filename: filename,
        summarized_filename: filename + '-sum.md',
        user: user,
        extension: file.mimetype,
      });

      filesInfo.push({
        name: filename,
        extension: file.mimetype,
      });

      dbFiles.push(newFile);
    }

    await this.databaseService.saveFiles(dbFiles);

    return filesInfo;
  }

  async analyzeFiles(filesInfo: FileInfo[]) {
    for (const file of filesInfo) {
      try {
        const response = await this.aiService.analyzeDocs(file);

        const content = response?.choices[0].message.content;
        if (!content) throw new Error('Empty Summarized Content');

        await this.minIOService.uploadContent(file.name + '-sum.md', content);
        await this.databaseService.updateFiles(file);

        this.logger.log('[analyzeFiles] Analyzed Successfully');
      } catch (error) {
        this.logger.error('[analyzeFiles]', (error as Error).message);
        await this.databaseService.updateFiles(
          file,
          false,
          (error as Error).message,
        );
      }
    }
  }

  async isValidFileOwnership(fileId: number, userId: number) {
    const fileInfo = await this.databaseService.getUserFileById(userId, fileId);

    if (!fileInfo) throw new ForbiddenException('Not Owner of the file');
    return fileInfo;
  }

  async searchByName(value: string, userId: number) {
    const files = await this.databaseService.getUserRelatedFilesByName(
      value,
      userId,
    );
    if (!files) return [];
    return files;
  }

  async getFileContent(userId: number, fileId: number) {
    const file = await this.databaseService.getUserFileById(userId, fileId);

    if (!file) throw new NotFoundException('File Not Found');

    const data = await this.minIOService.getContent(file.summarized_filename);

    return {
      filename: file.original_name,
      content: data,
    };
  }

  async getObject(filename: string) {
    return await this.minIOService.getFile(filename);
  }
}
