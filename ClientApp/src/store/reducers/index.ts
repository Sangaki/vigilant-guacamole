import { combineReducers } from '@reduxjs/toolkit';
import tasksReducer from 'src/Pages/Tasks/reducer';
import loginReducer from 'src/Pages/Login/reducer';
import registerReducer from 'src/Pages/Register/reducers';

const rootReducer = combineReducers({
  tasks: tasksReducer.reducer,
  login: loginReducer.reducer,
  register: registerReducer,
});

export default rootReducer;
