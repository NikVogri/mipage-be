import { IsString, Length, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must include at least 1 uppercase letter and at least 1 number',
  })
  password: string;

  @IsString()
  @Length(96, 96)
  token: string;
}
