import User from "./User";
import { TeamType } from "./Team";

export interface TeamUser {
  _id?: string;
  user: User;
  team: TeamType;
}
