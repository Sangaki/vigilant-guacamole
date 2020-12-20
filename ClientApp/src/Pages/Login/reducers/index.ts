import { LOGIN_FAIL, LOGIN_SUCCESS, LOGIN_LOADING, LoginDispatchTypes } from '../actions/loginTypes';
import { LoginResponseI} from "../../../api/auth";
import {setToken} from "../../../api";

export interface LoginStateI {
    loading: boolean;
    error: boolean;
    content: LoginResponseI;
    wasLoaded: boolean;
}

const defaultState: LoginStateI = {
    loading: false,
    error: false,
    content: { token: localStorage.getItem('userToken') || '' },
    wasLoaded: false,
};

export default (state: LoginStateI = defaultState, action: LoginDispatchTypes): LoginStateI => {
    switch (action.type) {
        case LOGIN_FAIL:
            return {
                ...state,
                loading: false,
                error: true,
                wasLoaded: true,
            };
        case LOGIN_LOADING:
            return {
                ...state,
                loading: true,
                error: false,
            };
        case LOGIN_SUCCESS:
            setToken(action.payload.token);
            return {
                ...state,
                loading: false,
                error: false,
                wasLoaded: true,
                content: action.payload,
            };
        default:
            return state;
    }
};
