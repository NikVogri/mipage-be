import { IsString, Length } from 'class-validator';

export class UpdateNotebookDto {
  @IsString()
  @Length(1, 255)
  title: string;
}
