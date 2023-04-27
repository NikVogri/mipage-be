import { IsString, MaxLength, MinLength } from 'class-validator';
import { IsXssSafe } from 'src/validators/xss-validator';

export class CreateTodoItemCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(4096)
  @IsXssSafe({
    allowedTags: {
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
    message: 'Invalid characters provided',
  })
  body: string;
}
