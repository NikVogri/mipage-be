import { IsOptional, IsString } from 'class-validator';

export class UpdateTodoItemDto {
  @IsString({ message: 'description should be of type string' })
  @IsOptional()
  title: string;

  @IsString({ message: 'description should be of type string' }) // TODO: create XSS validator
  @IsOptional()
  description: string;
}
