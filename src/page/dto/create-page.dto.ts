import { IsString, IsBoolean, IsEnum } from 'class-validator';
import { PageType } from '../page.entity';

export class CreatePageDto {
  @IsString()
  title: string;

  @IsBoolean()
  isPrivate: boolean;

  @IsEnum(PageType, {
    message: "type must be one of the following: 'notebook',  'todo'",
  })
  type: PageType;
}
