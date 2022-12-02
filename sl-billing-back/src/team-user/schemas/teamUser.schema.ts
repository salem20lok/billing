import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Team } from '../../team/schemas/team.schema';

export type TeamUserDocument = TeamUser & Document;

@Schema({ timestamps: true })
export class TeamUser {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User.name,
    index: true,
  })
  user: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: Team.name,
    index: true,
  })
  team: string;
}

export const TeamUserSchema = SchemaFactory.createForClass(TeamUser);
