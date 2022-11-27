import { IsOptional, IsString } from 'class-validator';
import { IsXssSafe } from 'src/validators/xss-validator';

export class UpdateTodoItemDto {
  @IsString()
  @IsOptional()
  @IsXssSafe({ message: 'Invalid characters in title field' })
  title: string;

  @IsString()
  @IsOptional()
  @IsXssSafe({
    allowedTags: {
      h1: [],
      h2: [],
      h3: [],
      p: [],
      br: [],
      u: [],
      i: [],
      strong: [],
      ol: ['type'],
      ul: ['type'],
      li: [],
      code: [],
      em: [],
    },
    message: 'Invalid characters provided in description field',
  })
  description: string;
}
