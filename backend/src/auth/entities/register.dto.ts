import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterDTO {
  @IsNotEmpty()
  @IsString()
  public readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  public readonly lastName: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 15, { message: 'Username must be between 5 and 15 characters' })
  @Transform(({ value }) => (value as string).trim().toLowerCase())
  public readonly username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 25, { message: 'Username must be between 8 and 25 characters' })
  public readonly password: string;
}
