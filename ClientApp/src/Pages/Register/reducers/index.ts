import { REGISTER_FAIL, REGISTER_SUCCESS, REGISTER_LOADING, RegisterDispatchTypes } from '../actions/registerTypes';

export interface RegisterStateI {
    loading: boolean;
    error: boolean;
    wasLoaded: boolean;
}

const defaultState: RegisterStateI = {
    loading: false,
    error: false,
    wasLoaded: false,
};

export default (state: RegisterStateI = defaultState, action: RegisterDispatchTypes): RegisterStateI => {
    switch (action.type) {
        case REGISTER_FAIL:
            return {
                ...state,
                loading: false,
                error: true,
                wasLoaded: true,
            };
        case REGISTER_LOADING:
            return {
                ...state,
                loading: true,
                error: false,
            };
        case REGISTER_SUCCESS:
            return {
                ...state,
                loading: false,
                error: false,
                wasLoaded: true,
            };
        default:
            return state;
    }
};
