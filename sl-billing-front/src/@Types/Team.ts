export interface TeamType {
  teamName: string;
  _id?: string;
  avatar: string;
  plan: string;
  createdAt?: string;
  users?: string[];
  name?: string;
  management?: string;
  teamUserAdd?: string[];
  teamUserDelete?: string[];
  feature?: string[];
  addFeature?: string[];
  deleteFeature?: string[];
}
