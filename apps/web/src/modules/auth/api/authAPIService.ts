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

export function AuthAPI(http: HttpService) {
  const baseUrl = `${appConfig.NEXT_PUBLIC_API_URL}/v1/auth`;

  return {
    getUser: () =>
      http.get(`${baseUrl}/me`, {
        credentials: 'include',
        responseSchema: getUserResponseSchema,
      }),

    login: (payload: LoginRequestDTO) =>
      http.post(`${baseUrl}/login`, {
        body: payload,
        credentials: 'include',
        responseSchema: loginResponseDTOSchema,
      }),

    logout: () =>
      http.post(`${baseUrl}/logout`, {
        credentials: 'include',
        responseSchema: logoutResponseSchema,
      }),

    signup: (payload: SignupRequestDTO) =>
      http.post(`${baseUrl}/signup`, {
        body: payload,
        credentials: 'include',
        responseSchema: signupResponseDTOSchema,
      }),
  };
}

export const authAPI = AuthAPI(HttpService());
