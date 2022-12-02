import User from "../../@Types/User";

export interface UsersState {
  error: boolean;
  loading: boolean;
  users: User[];
  count: number;
}

export interface fetchUsersState {
  skip: number;
  limit: number;
  firstName: string;
}
