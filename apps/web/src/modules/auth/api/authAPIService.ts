import { LoginRequestDTO, loginResponseDTOSchema } from '@movies/shared/communication';
import { HttpService } from '@movies/shared/services';

import { appConfig } from '@/config/appConfig';

export function AuthAPI(http: HttpService) {
  const baseUrl = `${appConfig.NEXT_PUBLIC_API_URL}/v1/auth`;

  return {
    login: (payload: LoginRequestDTO) =>
      http.post(`${baseUrl}/login`, {
        body: payload,
        responseSchema: loginResponseDTOSchema,
      }),
  };
}

export const authAPI = AuthAPI(HttpService());
