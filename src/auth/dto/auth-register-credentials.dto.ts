import {
  IsEmail,
  Matches,
  MinLength,
  IsString,
  MaxLength,
} from 'class-validator';
export class AuthRegisterCredentialsDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  @MaxLength(50)
  username: string;

  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  password: string;
}
