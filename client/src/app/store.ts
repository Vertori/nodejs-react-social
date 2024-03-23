import { configureStore } from "@reduxjs/toolkit";
import { useReducer } from "react";

export const store = configureStore({
  reducer: { user: useReducer },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
