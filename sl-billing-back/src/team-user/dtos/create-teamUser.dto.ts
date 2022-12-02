import { IsNotEmpty } from 'class-validator';

export class CreateTeamUserDto {
  @IsNotEmpty()
  user: string;

  @IsNotEmpty()
  team: string;
}
