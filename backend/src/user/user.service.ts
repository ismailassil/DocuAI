import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { File } from './entities/file.entity';
import { FileInfo } from './entities/file_info.type';
import { writeFile } from 'fs';
import { AIService } from 'src/ai/ai.service';
import path from 'path';
import { readFile } from 'fs/promises';
import { MinIoService } from 'src/min-io/min-io.service';

@Injectable()
export class UserService {
  constructor(
    private databaseService: DatabaseService,
    private aiService: AIService,
    private minIOService: MinIoService,
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
        extension: file.mimetype,
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
        console.log('[STATUS] Updated Successfully');
      } catch (error) {
        errorFiles.push({ info: file, error: (error as Error).message });
        console.log('[STATUS] Not Updated Successfully');
        await this.databaseService.updateFiles(file, false);
      }
    }
  }

  async isValidFileOwnership(fileId: number, userId: number) {
    const fileInfo = await this.databaseService.getUserFileById(userId, fileId);

    if (!fileInfo) throw new ForbiddenException('Not Owner of file');
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

    const filePath = path.join(
      __dirname,
      '../../uploads/' + file.summarized_filename,
    );

    try {
      const content = await readFile(filePath, 'utf-8');

      return {
        filename: file.original_name,
        content,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error Occurred while reading',
        (error as Error).message,
      );
    }
  }
}
