export interface ReqDataType{
  message: string;
  success: boolean;
  data?: object;
}

export interface AccessTokenInterface{
  access_token: string
}

export enum StatusFriendEnum {
  ACCEPT='accepted',
  DECLINED='declined',
  PENDING='pending'
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}