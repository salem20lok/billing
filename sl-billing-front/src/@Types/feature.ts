export interface FeatureType {
  _id?: string;
  featureName: string;
  createdAt?: string;
  name?: string;
  management?: string;
  plans?: string[];
}

export interface FeaturePaginationType {
  features: FeatureType[];
  count: number;
}
