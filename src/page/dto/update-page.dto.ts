import { IsString, IsBoolean } from 'class-validator';

export class UpdatePageDto {
  @IsString()
  title: string;

  @IsBoolean()
  isPrivate: boolean;
}
