// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { servicesReducer } from "./slices/servicesSlice";
import { usersReducer } from "./slices/usersSlice";
import { companiesReducer } from "./slices/companiesSlice";
import { legalEntitiesReducer } from "./slices/legalEntitiesSlice";
import { templatesReducer } from "./slices/templatesSlice";
import { contractsReducer } from "./slices/contractsSlice";
import { bankAccountsReducer } from "./slices/bankAccountsSlice";
import { billsReducer } from "./slices/billsSlice";
import { actsReducer } from "./slices/actsSlice";
import breadcrumbsReducer from "./slices/breadcrumbsSlice";

export const store = configureStore({
  reducer: {
    services: servicesReducer,
    users: usersReducer,
    companies: companiesReducer,
    legalEntities: legalEntitiesReducer,
    templates: templatesReducer,
    contracts: contractsReducer,
    bankAccounts: bankAccountsReducer,
    bills: billsReducer,
    acts: actsReducer,
    breadcrumbs: breadcrumbsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
