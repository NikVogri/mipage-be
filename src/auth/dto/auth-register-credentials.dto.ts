import {
  IsEmail,
  Matches,
  MinLength,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsXssSafe } from 'src/validators/xss-validator';

export class AuthRegisterCredentialsDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  @MaxLength(50)
  @IsXssSafe({ message: 'Invalid characters provided in username field' })
  username: string;

  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  password: string;
}
