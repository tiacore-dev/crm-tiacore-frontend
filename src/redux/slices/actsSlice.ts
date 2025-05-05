import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ActsState {
  contract?: string;
  buyer?: string;
  seller?: string;
  act_date_to?: number;
  act_date_from?: number;
  sort_by?: string;
  order?: string;
  page: number;
  page_size: number;
}

const initialState: ActsState = {
  contract: undefined,
  buyer: undefined,
  seller: undefined,
  act_date_to: undefined,
  act_date_from: undefined,
  sort_by: undefined,
  order: undefined,
  page: 1,
  page_size: 10,
};

export const actsSlice = createSlice({
  name: "acts",
  initialState,
  reducers: {
    setContract: (state, action: PayloadAction<string>) => {
      state.contract = action.payload;
      state.page = 1;
    },
    setBuyer: (state, action: PayloadAction<string>) => {
      state.buyer = action.payload;
      state.page = 1;
    },
    setSeller: (state, action: PayloadAction<string>) => {
      state.seller = action.payload;
      state.page = 1;
    },
    setDateTo: (state, action: PayloadAction<number>) => {
      state.act_date_to = action.payload;
      state.page = 1;
    },
    setDateFrom: (state, action: PayloadAction<number>) => {
      state.act_date_from = action.payload;
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
    resetState: () => initialState,
  },
});

export const {
  setContract,
  setBuyer,
  setSeller,
  setDateTo,
  setDateFrom,
  setSortBy,
  setOrder,
  setPage,
  setPageSize,
  resetState,
} = actsSlice.actions;

export const actsReducer = actsSlice.reducer;

export const actsSelector = createSelector(
  (state: RootState) => state.acts,
  (acts) => acts
);
