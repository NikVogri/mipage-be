import { IsString, Matches } from 'class-validator';
import { IsXssSafe } from 'src/validators/xss-validator';

export class CreateTodoDto {
  @IsString()
  @IsXssSafe({ message: 'Invalid characters provided in title field' })
  title: string;

  @Matches('^#[0-9a-z]{3,6}$')
  color: string;
}
