import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTodoItemCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(4096)
  body: string;
}
