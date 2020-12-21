import {combineReducers} from "redux";
import tasksReducer from '../../Pages/Tasks/reducers';
import loginReducer from '../../Pages/Login/reducers';
import registerReducer from '../../Pages/Register/reducers';

export const rootReducer = combineReducers({
    tasks: tasksReducer,
    login: loginReducer,
    register: registerReducer,
});
