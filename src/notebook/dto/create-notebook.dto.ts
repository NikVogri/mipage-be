import { IsString, Length } from 'class-validator';
import { IsXssSafe } from 'src/validators/xss-validator';

export class CreateNotebookDto {
  @IsString()
  @Length(1, 255)
  @IsXssSafe({ message: 'Invalid characters provided in title field' })
  title: string;
}
