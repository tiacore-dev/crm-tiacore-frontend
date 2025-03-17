// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { servicesReducer } from "./slices/servicesSlice";
import breadcrumbsReducer from "./slices/breadcrumbsSlice";

export const store = configureStore({
  reducer: {
    services: servicesReducer,
    breadcrumbs: breadcrumbsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
