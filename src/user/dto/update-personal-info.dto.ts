import { IsString, Length, MinLength } from 'class-validator';

export class UpdatePersonalInfoDto {
  @IsString()
  @MinLength(5)
  username: string;

  @IsString()
  @Length(0, 1024)
  bio: string;
}
