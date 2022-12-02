import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Plan } from '../../plan/schemas/plan.schema';
import { Feature } from '../../feature/schemas/feature.schema';

export type PlanFeatureDocument = PlanFeature & Document;

@Schema({ timestamps: true })
export class PlanFeature {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: Plan.name,
    index: true,
  })
  plan: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: Feature.name,
    index: true,
  })
  feature: string;
}

export const PlanFeatureSchema = SchemaFactory.createForClass(PlanFeature);
