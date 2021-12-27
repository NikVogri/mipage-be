import { IsEnum, IsString, Length } from 'class-validator';
import { NotebookBlockType } from '../notebook-block.entity';

export class CreateNotebookBlockDto {
  @IsString()
  @Length(1)
  content: string;

  @IsEnum(NotebookBlockType, {
    message: "type must be one of the following: 'image', 'richText', 'code'",
  })
  type: NotebookBlockType;
}
