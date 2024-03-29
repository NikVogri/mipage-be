import { IsString, Length, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  password: string;

  @IsString()
  @Length(96, 96)
  token: string;
}
