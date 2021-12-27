import { IsBoolean, IsString } from 'class-validator';

export class UpdateTodoItemDto {
  @IsString()
  title: string;

  @IsBoolean()
  completed: boolean;
}
