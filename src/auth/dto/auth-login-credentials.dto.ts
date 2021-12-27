import { IsEmail, IsString } from 'class-validator';
export class AuthLoginCredentialsDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
