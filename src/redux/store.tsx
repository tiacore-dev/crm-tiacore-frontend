// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { servicesReducer } from "./slices/servicesSlice";
import { usersReducer } from "./slices/usersSlice";
import { companiesReducer } from "./slices/companiesSlice";
import { legalEntitiesReducer } from "./slices/legalEntitiesSlice";

import breadcrumbsReducer from "./slices/breadcrumbsSlice";

export const store = configureStore({
  reducer: {
    services: servicesReducer,
    users: usersReducer,
    companies: companiesReducer,
    legalEntities: legalEntitiesReducer,
    breadcrumbs: breadcrumbsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
