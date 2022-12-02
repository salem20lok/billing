import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Plan } from '../../plan/schemas/plan.schema';

export type TeamDocument = Team & Document;

@Schema({ timestamps: true })
export class Team {
  @Prop({ type: String, required: true, index: true, unique: true })
  teamName: string;

  @Prop({ type: String, required: false, default: null })
  avatar: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: Plan.name,
  })
  plan: string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);

TeamSchema.index({ teamName: 'text' });
