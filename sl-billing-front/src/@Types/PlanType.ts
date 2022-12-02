export interface PlanType {
  _id?: string;
  planName: string;
  createdAt?: string;
  name?: string;
  management?: string;
  addFeature?: string[];
  deleteFeature?: string[];
  feature?: string[];
}

export interface planPaginationType {
  plans: PlanType[];
  count: number;
}
