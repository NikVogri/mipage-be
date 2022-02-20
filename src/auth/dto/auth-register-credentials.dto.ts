import { IsEmail, Matches, MinLength, IsString } from 'class-validator';
export class AuthRegisterCredentialsDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  username: string;

  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must include at least 1 uppercase letter and at least 1 number',
  })
  password: string;
}
