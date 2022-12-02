import { IsNotEmpty } from 'class-validator';

export class CreatePlanFeatureDto {
  @IsNotEmpty()
  plan: string;

  @IsNotEmpty()
  feature: string;
}
