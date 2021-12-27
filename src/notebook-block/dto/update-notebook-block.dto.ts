import { IsString, Length } from 'class-validator';

export class UpdateNotebookBlockDto {
  @IsString()
  @Length(1)
  content: string;
}
