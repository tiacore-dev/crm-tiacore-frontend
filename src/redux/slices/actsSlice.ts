import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ActsState {
  contract: string;
  page: number;
  page_size: number;
}

const initialState: ActsState = {
  contract: "",
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

export const { setContract, setPage, setPageSize, resetState } =
  actsSlice.actions;

export const actsReducer = actsSlice.reducer;

export const actsSelector = createSelector(
  (state: RootState) => state.acts,
  (acts) => acts
);
