import { IsString, Length } from 'class-validator';

export class CreateNotebookDto {
  @IsString()
  @Length(1, 255)
  title: string;
}
