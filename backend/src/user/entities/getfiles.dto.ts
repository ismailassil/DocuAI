import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GET_FILES_DTO {
  @Type(() => Number)
  @IsInt({ message: 'page must be an integer' })
  @Min(1, { message: 'page must be at least 1' })
  page: number;
}
