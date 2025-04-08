import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ContractsState {
  buyer: string;
  seller: string;
  status: string;
  page: number;
  page_size: number;
}

const initialState: ContractsState = {
  buyer: "",
  seller: "",
  status: "",
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
  setPage,
  setPageSize,
  resetState,
} = contractsSlice.actions;

export const contractsReducer = contractsSlice.reducer;

export const contractsSelector = createSelector(
  (state: RootState) => state.contracts,
  (contracts) => contracts
);
