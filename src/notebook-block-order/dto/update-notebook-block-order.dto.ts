import { IsArray, IsUUID } from 'class-validator';

export class UpdateNotebookBlockOrderDto {
  @IsArray()
  @IsUUID('4', { each: true, message: "Values must be notebook block id's" })
  order: string[];
}
