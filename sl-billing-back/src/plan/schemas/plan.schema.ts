import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlanDocument = Plan & Document;

@Schema()
export class Plan {
  @Prop({ type: String, required: true, unique: true })
  planName: string;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);

PlanSchema.index({ planName: 'text' });
