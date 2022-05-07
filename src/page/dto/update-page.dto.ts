import { IsString, IsBoolean, MinLength } from 'class-validator';

export class UpdatePageDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsBoolean()
  isPrivate: boolean;
}
