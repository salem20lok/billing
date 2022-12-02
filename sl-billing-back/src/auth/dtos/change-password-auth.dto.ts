import { IsNotEmpty, Matches } from 'class-validator';

export class ChangePasswordAuthDto {
  @IsNotEmpty()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is not a format',
  })
  password: string;

  @IsNotEmpty()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is not a format',
  })
  confirmePassword: string;
}
