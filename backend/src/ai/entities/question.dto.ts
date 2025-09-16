import { IsNotEmpty, IsString } from 'class-validator';

export class QUESTION_DTO {
  @IsString()
  @IsNotEmpty()
  question: string;
}
