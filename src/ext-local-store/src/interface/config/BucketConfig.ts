
export interface BucketConfig {
  isPublic: boolean;
  name: string;
  operator: string;
  password: string;
  directory: string;
  request_expire: number;
  base_url: string;
  token_secret_key?: string;
  token_expire?: number
}
