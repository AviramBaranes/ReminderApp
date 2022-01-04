import { createSlice } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';

const initialState = {
  socket: null,
  userId: '',
} as {
  socket: null | Socket;
  userId: string;
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    newSocket(state, { payload }) {
      state.socket = payload.socket;
    },
    newUser(state, { payload }) {
      state.userId = payload.userId;
    },
  },
});

export default socketSlice.reducer;

export const socketActions = socketSlice.actions;
