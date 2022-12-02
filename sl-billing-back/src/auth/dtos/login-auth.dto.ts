import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is not a format',
  })
  password: string;
}
