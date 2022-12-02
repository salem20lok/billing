import { PlanType } from "./PlanType";
import { FeatureType } from "./feature";

export interface PlanFeatureType {
  plan: PlanType;
  feature: FeatureType;
  _id: string;
}
