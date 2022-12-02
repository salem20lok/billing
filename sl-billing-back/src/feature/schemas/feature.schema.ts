import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FeatureDocument = Feature & Document;

@Schema({ timestamps: true })
export class Feature {
  @Prop({ type: String, unique: true, required: true, index: true })
  featureName: string;
}

export const FeatureSchema = SchemaFactory.createForClass(Feature);
FeatureSchema.index({ featureName: 'text' });
