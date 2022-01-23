import { IsEnum } from 'class-validator';
import { NotebookBlockType } from '../notebook-block.entity';

export class CreateNotebookBlockDto {
  @IsEnum(NotebookBlockType, {
    message: "type must be one of the following: 'image', 'richText', 'code'",
  })
  type: NotebookBlockType;
}
