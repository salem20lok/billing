import User from "./User";
import { Permission } from "./Permission";

export interface UserPermission {
  _id: string;
  user: User;
  permission: Permission;
}
