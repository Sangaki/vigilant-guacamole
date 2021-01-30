import { LoginResponseI } from '../../../api/auth';

export const LOGIN_LOADING = 'LOGIN_LOADING';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export interface LoginLoading {
  type: typeof LOGIN_LOADING;
}

export interface LoginSuccess {
  type: typeof LOGIN_SUCCESS;
  payload: LoginResponseI;
}

export interface LoginFail {
  type: typeof LOGIN_FAIL;
}

export type LoginDispatchTypes = LoginLoading | LoginSuccess | LoginFail;
