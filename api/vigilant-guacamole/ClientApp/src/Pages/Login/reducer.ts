import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setToken } from 'src/api';
import { loginRequest, LoginResponseI, signoutRequest } from 'src/api/auth';
import { LoginI } from 'src/shared/types/Login';

interface LoginReducerStateI {
  token: string,
  error: string,
}

const loginInitialState: LoginReducerStateI = {
  token: localStorage.getItem('accessToken') || '',
  error: '',
};

export const loginUser = createAsyncThunk(
  'login/userLogIn',
  async (loginData: LoginI): Promise<LoginResponseI> => {
    const response = await loginRequest(loginData);
    return (response.data);
  }
);

export const logoutUser = createAsyncThunk(
  'login/userLogOut',
  async (): Promise<void> => {
    await signoutRequest();
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState: loginInitialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponseI>) => {
      setToken(action.payload);
      // eslint-disable-next-line no-param-reassign
      state.token = action.payload.accessToken;
    });
    builder.addCase(loginUser.rejected, (state) => {
      // eslint-disable-next-line no-param-reassign
      state.error = 'Bad request';
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      // eslint-disable-next-line no-param-reassign
      state = loginInitialState;
      localStorage.removeItem('userId');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('expires');
    });
    builder.addCase(logoutUser.rejected, (state) => {
      // eslint-disable-next-line no-param-reassign
      state = loginInitialState;
      localStorage.removeItem('userId');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('expires');
    });
  }
});

export default loginSlice;