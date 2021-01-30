export const REGISTER_LOADING = 'REGISTER_LOADING';
export const REGISTER_FAIL = 'REGISTER_FAIL';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';

export interface RegisterLoading {
  type: typeof REGISTER_LOADING;
}

export interface RegisterSuccess {
  type: typeof REGISTER_SUCCESS;
}

export interface RegisterFail {
  type: typeof REGISTER_FAIL;
}

export type RegisterDispatchTypes = RegisterLoading | RegisterSuccess | RegisterFail;
