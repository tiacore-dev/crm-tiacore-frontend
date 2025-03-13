// src/redux/slices/servicesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1; // Сброс страницы на первую при изменении размера страницы
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.currentPage = 1; // Сброс страницы на первую при изменении поиска
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

export default servicesSlice.reducer;
