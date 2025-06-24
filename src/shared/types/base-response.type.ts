export type BaseResponse<T, K = Record<string, unknown>> = {
  success: boolean;
  data: T;
  message: string;
  timestamp: Date;
  metadata?: K;
};
