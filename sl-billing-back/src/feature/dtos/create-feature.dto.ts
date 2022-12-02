import { IsNotEmpty } from 'class-validator';

export class CreateFeatureDto {
  @IsNotEmpty()
  featureName: string;

  plans?: string[];
}
