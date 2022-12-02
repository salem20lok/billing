import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Team } from '../../team/schemas/team.schema';
import { Feature } from '../../feature/schemas/feature.schema';

export type TeamFeatureDocument = TeamFeature & Document;

@Schema()
export class TeamFeature {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: Team.name,
  })
  team: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: Feature.name,
  })
  feature: string;
}

export const TeamFeatureSchema = SchemaFactory.createForClass(TeamFeature);
