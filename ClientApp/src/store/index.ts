import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import rootReducer from './reducers';

export const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware()],
});

export type RootStateI = ReturnType<typeof store.getState>;