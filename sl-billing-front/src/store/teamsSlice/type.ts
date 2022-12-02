import { TeamType } from "../../@Types/Team";

export interface TeamsState {
  error: boolean;
  loading: boolean;
  teams: TeamType[];
  count: number;
}

export interface fetchTeamsState {
  skip: number;
  limit: number;
  teamName: string;
}
