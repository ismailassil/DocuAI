import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { File } from './entities/file.entity';
import { FileInfo } from './entities/file_info.type';
import { writeFile } from 'fs';
import path from 'path';
import { AIService } from 'src/ai/ai.service';

@Injectable()
export class UserService {
  constructor(
    private databaseService: DatabaseService,
    private aiService: AIService,
  ) {}

  async filterAndSaveFiles(files: Express.Multer.File[], userId: number) {
    const dbFiles: File[] = [];
    const user = await this.databaseService.getUserById(userId);
    const filesInfo: FileInfo[] = [];

    if (!user) throw new NotFoundException('User Not Found');

    files.forEach((file) => {
      const newFile = new File({
        original_name: file.originalname,
        filename: file.filename,
        summarized_filename: file.filename + '-sum.md',
        user: user,
      });

      filesInfo.push({
        name: file.filename,
        extension: file.mimetype,
      });

      dbFiles.push(newFile);
    });

    await this.databaseService.saveFiles(dbFiles);

    return filesInfo;
  }

  generateSummarizedFile(content: string, fileInfo: FileInfo) {
    const filename = path.join(
      __dirname,
      '../../uploads',
      fileInfo.name + '-sum.md',
    );
    writeFile(filename, content, 'utf-8', (err) => {
      if (err) {
        throw new Error('Writing file', err);
      }
    });
  }

  async analyzeFiles(filesInfo: FileInfo[]) {
    const errorFiles: { info: FileInfo; error: string }[] = [];

    for (const file of filesInfo) {
      try {
        // TODO - Upload the file into deepseek for analyzing and getting new file summarized
        const response = await this.aiService.analyzeDocs(file);

        const content = response.choices[0].message.content;
        if (!content) throw new Error('Empty Summarized Content');

        this.generateSummarizedFile(content, file);
        await this.databaseService.updateFiles(file);
      } catch (error) {
        errorFiles.push({ info: file, error: (error as Error).message });
      }
    }
  }

  async isValidFileOwnership(fileId: number, userId: number) {
    const fileInfo = await this.databaseService.getUserFileById(fileId, userId);
    if (!fileInfo) throw new ForbiddenException('Not Owner of file');
    return fileInfo;
  }
}
