import { Dispatch } from 'redux';
import { LOGIN_FAIL, LOGIN_SUCCESS, LOGIN_LOADING, LoginDispatchTypes } from './loginTypes';
import { loginRequest } from "../../../api/auth";
import { LoginI } from "../../../shared/types/Login";

export const LoginDispatch = (loginData: LoginI) => async (dispatch: Dispatch<LoginDispatchTypes>) => {
    try {
        dispatch({
            type: LOGIN_LOADING,
        });
        const response = await loginRequest(loginData);
        const payload = response.data;

        dispatch({
            type: LOGIN_SUCCESS,
            payload,
        });
    } catch (error) {
        dispatch({
            type: LOGIN_FAIL,
        });
    }
};
