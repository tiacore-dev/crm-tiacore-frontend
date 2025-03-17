import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ServicesState {
  currentPage: number;
  pageSize: number;
  search: string;
  sortBy: string;
  order: string;
}

const initialState: ServicesState = {
  currentPage: 1,
  pageSize: 10,
  search: "",
  sortBy: "service_name",
  order: "asc",
};

export const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.currentPage = 1;
    },
    setSort: (
      state,
      action: PayloadAction<{ sortBy: string; order: string }>
    ) => {
      state.sortBy = action.payload.sortBy;
      state.order = action.payload.order;
    },
  },
});

export const { setPage, setPageSize, setSearch, setSort } =
  servicesSlice.actions;

export const servicesReducer = servicesSlice.reducer;

export const servicesSelector = createSelector((state: RootState) => state.services, (services) => services)
