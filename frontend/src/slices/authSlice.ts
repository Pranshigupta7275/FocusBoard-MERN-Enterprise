import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// 1. Safely grab the string from local storage
const storedUserInfo = localStorage.getItem('userInfo');

// 2. SAFETY CHECK: Only parse if it actually exists AND isn't the string "undefined"
let initialUserInfo = null;
if (storedUserInfo && storedUserInfo !== "undefined") {
  try {
    initialUserInfo = JSON.parse(storedUserInfo);
  } catch (error) {
    console.error("Failed to parse userInfo from local storage:", error);
    initialUserInfo = null;
  }
}

const initialState = {
  userInfo: initialUserInfo,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Called when the user successfully logs in
    setCredentials: (state, action: PayloadAction<any>) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    // Called when the user logs out
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;