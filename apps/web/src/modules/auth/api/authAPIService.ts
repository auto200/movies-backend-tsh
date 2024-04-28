import {
  LoginRequestDTO,
  SignupRequestDTO,
  getUserResponseSchema,
  loginResponseDTOSchema,
  logoutResponseSchema,
  signupResponseDTOSchema,
} from '@movies/shared/communication';
import { HttpService } from '@movies/shared/services';

import { appConfig } from '@/config/appConfig';
import { authFetch } from '@/utils/authFetch';

export function AuthAPI(authHttp: HttpService) {
  const baseUrl = `${appConfig.NEXT_PUBLIC_API_URL}/v1/auth`;

  return {
    getUser: () =>
      authHttp.get(`${baseUrl}/me`, {
        credentials: 'include',
        responseSchema: getUserResponseSchema,
      }),

    login: (payload: LoginRequestDTO) =>
      authHttp.post(`${baseUrl}/login`, {
        body: payload,
        credentials: 'include',
        responseSchema: loginResponseDTOSchema,
      }),

    logout: () =>
      authHttp.post(`${baseUrl}/logout`, {
        credentials: 'include',
        responseSchema: logoutResponseSchema,
      }),

    signup: (payload: SignupRequestDTO) =>
      authHttp.post(`${baseUrl}/signup`, {
        body: payload,
        credentials: 'include',
        responseSchema: signupResponseDTOSchema,
      }),
  };
}

export const authAPI = AuthAPI(HttpService(authFetch()));
