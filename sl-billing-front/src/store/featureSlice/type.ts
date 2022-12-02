import { FeatureType } from "../../@Types/feature";

export interface FeaturesState {
  error: boolean;
  loading: boolean;
  features: FeatureType[];
  count: number;
}

export interface fetchFeatureState {
  skip: number;
  limit: number;
  featureName: string;
}
