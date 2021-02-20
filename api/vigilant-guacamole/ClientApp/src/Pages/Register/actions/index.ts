import { Dispatch } from 'redux';
import { REGISTER_FAIL, REGISTER_LOADING, REGISTER_SUCCESS, RegisterDispatchTypes } from './registerTypes';
import { registerRequest } from '../../../api/auth';
import { RegisterI } from '../../../shared/types/Login';

export const RegisterDispatch = (registerData: RegisterI) => async (dispatch: Dispatch<RegisterDispatchTypes>) => {
  try {
    dispatch({
      type: REGISTER_LOADING,
    });
        
    await registerRequest(registerData);
        
    dispatch({
      type: REGISTER_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};
