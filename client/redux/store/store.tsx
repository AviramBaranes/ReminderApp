import { configureStore } from '@reduxjs/toolkit';

import socketSlice from '../slices/socketSlice';

const store = configureStore({
  reducer: {
    socketSlice,
  },

  //socket is not serializable
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
