import { File } from './file.entity';

export class FileDTO {
  id: number;
  filename: string;
  createdAt: Date;
  is_summarized: boolean;

  constructor(file: File, name: string) {
    this.id = file.id;
    this.filename = name;
    this.createdAt = file.createdAt;
    this.is_summarized = file.is_summarized;
  }
}
