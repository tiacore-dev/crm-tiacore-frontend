import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface BankAccountsState {
  legal_entity: string;
  bank_name: string;
  page: number;
  page_size: number;
}

const initialState: BankAccountsState = {
  legal_entity: "",
  bank_name: "",
  page: 1,
  page_size: 10,
};

export const bankAccountsSlice = createSlice({
  name: "bank_accounts",
  initialState,
  reducers: {
    setLegalEntity: (state, action: PayloadAction<string>) => {
      state.legal_entity = action.payload;
      state.page = 1;
    },
    setBankName: (state, action: PayloadAction<string>) => {
      state.bank_name = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.page_size = action.payload;
      state.page = 1;
    },
    resetState: () => initialState, // Добавляем действие для сброса состояния
  },
});

export const { setLegalEntity, setBankName, setPage, setPageSize, resetState } =
  bankAccountsSlice.actions;

export const bankAccountsReducer = bankAccountsSlice.reducer;

export const bankAccountsSelector = createSelector(
  (state: RootState) => state.bankAccounts,
  (bankAccounts) => bankAccounts
);
