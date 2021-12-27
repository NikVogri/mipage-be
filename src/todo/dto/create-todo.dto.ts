import { IsString, Matches } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  title: string;

  @Matches('^#[0-9a-z]{3,6}$')
  color: string;
}
