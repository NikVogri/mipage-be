import { IsOptional, IsString } from 'class-validator';

export class UpdateTodoItemDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString() // TODO: create XSS validator service when adding WSYWIG
  @IsOptional()
  description: string;
}
