import { BaseResponse } from '#/shared/types';

export type RefreshTokenResponse<T> = BaseResponse<T> & { refreshToken: string };
