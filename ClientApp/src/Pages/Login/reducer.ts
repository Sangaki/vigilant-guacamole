import { createAction, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginRequest, LoginResponseI } from 'src/api/auth';
import { LoginI } from 'src/shared/types/Login';
import { setToken } from '../../api';

interface LoginReducerStateI {
  token: string,
  error: string,
}

const loginInitialState: LoginReducerStateI = {
  token: localStorage.getItem('userToken') || '',
  error: '',
};

export const logoutUser = createAction(
  'login/userLogOut',
  () => {
    return { payload: { ...loginInitialState } };
  }
);

export const loginUser = createAsyncThunk(
  'login/userLogIn',
  async (loginData: LoginI): Promise<LoginResponseI> => {
    const response = await loginRequest(loginData);
    return (response.data);
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState: loginInitialState,
  reducers: {
    logout(state, ) {
      // eslint-disable-next-line no-param-reassign
      state = loginInitialState;
    },
  },
  extraReducers: builder => {
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponseI>) => {
      setToken(action.payload.token);
      // eslint-disable-next-line no-param-reassign
      state.token = action.payload.token;
    });
    builder.addCase(loginUser.rejected, (state) => {
      // eslint-disable-next-line no-param-reassign
      state.error = 'Bad request';
    });
  },
});

export default loginSlice;