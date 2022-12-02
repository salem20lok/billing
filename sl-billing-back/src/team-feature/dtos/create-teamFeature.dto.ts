import { IsNotEmpty } from 'class-validator';

export class CreateTeamFeatureDto {
  @IsNotEmpty()
  team: string;

  @IsNotEmpty()
  feature: string;
}
