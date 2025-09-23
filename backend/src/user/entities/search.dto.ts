import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SEARCH_DTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  value: string;
}
