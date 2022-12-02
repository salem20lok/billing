import { IsNotEmpty } from 'class-validator';

export class CreatePlanDto {
  @IsNotEmpty()
  planName: string;

  addFeature?: string[];
}
