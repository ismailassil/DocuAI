import { File } from './file.entity';

export class FileDTO {
  id: number;
  filename: string;
  createdAt: Date;
  is_summarized: boolean;
  is_processing: boolean;

  constructor(file: File, name?: string | null) {
    this.id = file.id;
    if (!name || name === null || name.length === 0) {
      this.filename = file.original_name;
    } else {
      this.filename = name || '';
    }
    this.createdAt = file.createdAt;
    this.is_summarized = file.is_summarized;
    this.is_processing = file.is_processing;
  }
}
