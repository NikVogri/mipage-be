import { IsUUID } from 'class-validator';

export class RemoveFromPageDto {
  @IsUUID()
  memberId: string;
}
