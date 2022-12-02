export default interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
  password?: string;
  confirmePassword?: string;
  name?: string;
  management?: string;
  teams?: string[];
  permission?: string[];
  permissionAdd?: string[];
  permissionDelete?: string[];
  teamsAdd?: string[];
  teamsDelete?: string[];
}
