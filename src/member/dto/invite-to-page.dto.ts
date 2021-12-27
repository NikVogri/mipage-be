import { IsEmail } from 'class-validator';

export class InviteToPageDto {
  @IsEmail()
  email: string;
}
