import { IsString } from 'class-validator';
import { IsXssSafe } from 'src/validators/xss-validator';

export class CreateTodoItemDto {
  @IsString()
  @IsXssSafe({ message: 'Invalid characters provided in title field' })
  title: string;
}
