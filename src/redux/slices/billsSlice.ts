import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface BillsState {
  bank_account?: string;
  contract?: string;
  bill_date_to?: number;
  bill_date_from?: number;
  sort_by?: string;
  order?: string;
  page: number;
  page_size: number;
}

const initialState: BillsState = {
  bank_account: undefined,
  contract: undefined,
  bill_date_to: undefined,
  bill_date_from: undefined,
  sort_by: undefined,
  order: undefined,
  page: 1,
  page_size: 10,
};

export const billsSlice = createSlice({
  name: "bills",
  initialState,
  reducers: {
    setBankAccount: (state, action: PayloadAction<string>) => {
      state.bank_account = action.payload;
      state.page = 1;
    },
    setContract: (state, action: PayloadAction<string>) => {
      state.contract = action.payload;
      state.page = 1;
    },
    setDateTo: (state, action: PayloadAction<number>) => {
      state.bill_date_to = action.payload;
      state.page = 1;
    },
    setDateFrom: (state, action: PayloadAction<number>) => {
      state.bill_date_from = action.payload;
      state.page = 1;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sort_by = action.payload;
      state.page = 1;
    },
    setOrder: (state, action: PayloadAction<string>) => {
      state.order = action.payload;
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

export const {
  setBankAccount,
  setContract,
  setDateTo,
  setDateFrom,
  setSortBy,
  setOrder,
  setPage,
  setPageSize,
  resetState,
} = billsSlice.actions;

export const billsReducer = billsSlice.reducer;

export const billsSelector = createSelector(
  (state: RootState) => state.bills,
  (bills) => bills
);
