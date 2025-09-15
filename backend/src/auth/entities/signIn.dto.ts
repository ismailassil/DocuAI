import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class signInDTO {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => {
    return (value as string).trim().toLowerCase();
  })
  @Length(5, 15, { message: 'Username must be between 5 and 15 characters' })
  public readonly username: string;

  @IsNotEmpty()
  @Length(8, 25, { message: 'Password must be between 8 and 25 characters' })
  @IsString()
  public readonly password: string;
}
