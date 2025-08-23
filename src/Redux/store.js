// src/Redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slice/cartSlice';
import authReducer from "./slice/authSlice"

export const store = configureStore({
  devTools:false,
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
});

