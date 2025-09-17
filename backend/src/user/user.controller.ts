import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DatabaseService } from 'src/database/database.service';

@Controller('user')
export class UserController {
  constructor(private readonly databaseService: DatabaseService) {}

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
  uploadFile(@UploadedFiles() files: { files?: Express.Multer.File[] }) {
    if (files) {
      console.log(files['files']);
    }

    // TODO - register the filename + the originalname of the file into DB

    // TODO - Upload the file into deepseek for analyzing and getting new file summarized

    return { message: 'Files Uploaded Successfully' };
  }
}
