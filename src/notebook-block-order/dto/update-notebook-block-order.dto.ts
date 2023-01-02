import { IsArray, IsUUID } from 'class-validator';

export class UpdateNotebookBlockOrderDto {
  @IsUUID('4', { message: 'UUIDs must be valid' })
  movedBlockId: string;

  @IsUUID('4', { message: 'UUIDs must be valid' })
  previousBlockId: string;
}
