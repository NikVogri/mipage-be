import { IsString, IsBoolean, IsEnum, MinLength } from 'class-validator';
import { IsXssSafe } from 'src/validators/xss-validator';
import { PageType } from '../page.entity';

export class CreatePageDto {
  @IsString()
  @MinLength(3)
  @IsXssSafe({ message: 'Invalid characters provided in title field' })
  title: string;

  @IsBoolean()
  isPrivate: boolean;

  @IsEnum(PageType, {
    message: "type must be one of the following: 'notebook',  'todo'",
  })
  type: PageType;
}
