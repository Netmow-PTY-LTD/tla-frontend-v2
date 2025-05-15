import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      Cookies.set('token', token);
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      Cookies.remove('token');
    },
  },
});

export const { setUser, logOut } = authSlice.actions;

export default authSlice.reducer;

export const useCurrentToken = (state) => state.auth.token;
export const selectCurrentUser = (state) => state.auth.user;
