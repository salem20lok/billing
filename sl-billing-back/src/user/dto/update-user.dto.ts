export class UpdateUserDto {
  firstName: string;

  lastName: string;

  email: string;

  password: string;

  role: string;

  avatar: string;

  permissionAdd?: string[];
  permissionDelete?: string[];

  teamsAdd: [];
  teamsDelete: [];

  permission?: string[];

  teams?: [];
}
