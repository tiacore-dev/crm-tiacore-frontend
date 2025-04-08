import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface BillsState {
  bank_account: string;
  contract: string;
  page: number;
  page_size: number;
}

const initialState: BillsState = {
  bank_account: "",
  contract: "",
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

export const { setBankAccount, setContract, setPage, setPageSize, resetState } =
  billsSlice.actions;

export const billsReducer = billsSlice.reducer;

export const billsSelector = createSelector(
  (state: RootState) => state.bills,
  (bills) => bills
);
