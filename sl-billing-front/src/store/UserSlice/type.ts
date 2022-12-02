import User from "../../@Types/User";
import { UserPermission } from "../../@Types/UserPermission";

export interface UserState {
  error: boolean;
  loading: boolean;
  user: User;
  permission: UserPermission[];
}

export interface saveProfilePayload {
  user: User;
  permission: UserPermission[];
}
