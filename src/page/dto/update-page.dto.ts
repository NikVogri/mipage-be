import { IsString, IsBoolean, MinLength } from 'class-validator';
import { IsXssSafe } from 'src/validators/xss-validator';

export class UpdatePageDto {
  @IsString()
  @MinLength(3)
  @IsXssSafe({ message: 'Invalid characters provided in title field' })
  title: string;

  @IsBoolean()
  isPrivate: boolean;
}
