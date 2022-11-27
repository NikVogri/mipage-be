import { IsString, Length, MinLength } from 'class-validator';
import { IsXssSafe } from 'src/validators/xss-validator';

export class UpdatePersonalInfoDto {
  @IsString()
  @MinLength(5)
  @IsXssSafe({ message: 'Invalid characters provided in username field' })
  username: string;

  @IsString()
  @Length(0, 1024)
  @IsXssSafe({ message: 'Invalid characters provided in bio field' })
  bio: string;
}
