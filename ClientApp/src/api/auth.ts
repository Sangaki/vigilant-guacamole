import { AxiosResponse } from 'axios';
import { JsonWebTokenI, LoginI, RegisterI, TokenDtoI } from 'src/shared/types/Login';
import axios from './index';

export interface LoginResponseI {
  accessToken: string,
  refreshToken: string,
  expires: Date,
  userId: string,
}

export function loginRequest(loginData: LoginI): Promise<AxiosResponse<LoginResponseI>> {
  return axios.post('/auth/sign-in', {
    ...loginData,
  });
}

export function registerRequest(registerData: RegisterI): Promise<AxiosResponse<void>> {
  return axios.post('/auth/sign-up', {
    ...registerData,
  });
}

export function updateTokenRequest(token: TokenDtoI): Promise<AxiosResponse<JsonWebTokenI>> {
  return axios.post('/auth/tokens/refresh', {
    token
  });
}

export function signoutRequest(): Promise<AxiosResponse<void>> {
  return axios.post('/auth/tokens/cancel');
}
