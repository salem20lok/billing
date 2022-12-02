import { PlanType } from "../../@Types/PlanType";

export interface PlansState {
  error: boolean;
  loading: boolean;
  plans: PlanType[];
  count: number;
}

export interface fetchPlansState {
  skip: number;
  limit: number;
  planName: string;
}
