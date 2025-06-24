import { type BaseResponse } from '../types';

export function withBaseResponse<T, K = Record<string, unknown>>({
  success,
  message,
  data,
  timestamp,
  metadata,
}: BaseResponse<T, K>): BaseResponse<T, K> {
  return {
    success,
    message,
    timestamp,
    data,
    metadata: metadata,
  };
}
