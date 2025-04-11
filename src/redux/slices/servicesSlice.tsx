import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ServicesState {
  page: number;
  page_size: number;
  search: string;
}

const initialState: ServicesState = {
  page: 1,
  page_size: 10,
  search: "",
};

export const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.page_size = action.payload;
      state.page = 1;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },
    resetState: () => initialState, // Добавляем действие для сброса состояния
  },
});

export const { setPage, setPageSize, setSearch, resetState } =
  servicesSlice.actions;

export const servicesReducer = servicesSlice.reducer;

export const servicesSelector = createSelector(
  (state: RootState) => state.services,
  (services) => services
);
