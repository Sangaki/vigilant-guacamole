import { AxiosResponse } from 'axios';
import axios from './index';
import { LoginI, RegisterI } from '../shared/types/Login';

export interface LoginResponseI {
  token: string,
}

export function loginRequest(loginData: LoginI): Promise<AxiosResponse<LoginResponseI>> {
  return axios.post('/auth/login', {
    ...loginData,
  });
}

export function registerRequest(registerData: RegisterI): Promise<AxiosResponse<void>> {
  return axios.post('/auth/register', {
    ...registerData,
  });
}
