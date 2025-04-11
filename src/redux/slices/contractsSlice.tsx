import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ContractsState {
  buyer?: string;
  seller?: string;
  status?: string;
  contract_date_to?: number;
  contract_date_from?: number;
  sort_by?: string;
  order?: string;
  page: number;
  page_size: number;
}

const initialState: ContractsState = {
  buyer: undefined,
  seller: undefined,
  status: undefined,
  contract_date_to: undefined,
  contract_date_from: undefined,
  sort_by: undefined,
  order: undefined,
  page: 1,
  page_size: 10,
};

export const contractsSlice = createSlice({
  name: "contracts",
  initialState,
  reducers: {
    setBuyer: (state, action: PayloadAction<string>) => {
      state.buyer = action.payload;
      state.page = 1;
    },
    setSeller: (state, action: PayloadAction<string>) => {
      state.seller = action.payload;
      state.page = 1;
    },
    setStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
      state.page = 1;
    },
    setContractDateTo: (state, action: PayloadAction<number>) => {
      state.contract_date_to = action.payload;
      state.page = 1;
    },
    setContractDateFrom: (state, action: PayloadAction<number>) => {
      state.contract_date_from = action.payload;
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
  setBuyer,
  setSeller,
  setStatus,
  setContractDateTo,
  setContractDateFrom,
  setSortBy,
  setOrder,
  setPage,
  setPageSize,
  resetState,
} = contractsSlice.actions;

export const contractsReducer = contractsSlice.reducer;

export const contractsSelector = createSelector(
  (state: RootState) => state.contracts,
  (contracts) => contracts
);
