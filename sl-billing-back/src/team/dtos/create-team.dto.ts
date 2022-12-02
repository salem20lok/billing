import { IsNotEmpty } from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty()
  teamName: string;

  avatar?: string;

  @IsNotEmpty()
  plan: string;

  users?: string[];

  addFeature?: string[];
}
