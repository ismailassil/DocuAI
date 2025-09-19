import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { File } from './entities/file.entity';
import { FileInfo } from './entities/file_info.type';
import { writeFile } from 'fs';
import path from 'path';

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}

  async filterAndSaveFiles(files: Express.Multer.File[]) {
    const dbFiles: File[] = [];
    const user = await this.databaseService.getUserById(1);
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
        ext: file.mimetype,
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
}
