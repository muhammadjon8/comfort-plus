import { SetMetadata } from '@nestjs/common';

export const SET_REFRESH_TOKEN = 'set-refresh-token';

export const SetRefreshToken = () => SetMetadata(SET_REFRESH_TOKEN, true);
