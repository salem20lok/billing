export class UpdateTeamDto {
  teamName: string;

  avatar: string;

  plan: string;

  users?: string[];

  teamUserAdd?: string[];
  teamUserDelete?: string[];

  addFeature?: string[];
  deleteFeature?: string[];
}
