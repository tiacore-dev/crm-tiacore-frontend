import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface CompaniesState {
  currentPage: number;
  pageSize: number;
  search: string;
  sortBy: string;
  order: string;
  //   filters: Record<string, any>; // Добавляем поле для хранения фильтров
}

const initialState: CompaniesState = {
  currentPage: 1,
  pageSize: 10,
  search: "",
  sortBy: "company_name",
  order: "asc",
  //   filters: {},
};

export const companiesSlice = createSlice({
  name: "companies",
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
    // setFilters: (state, action: PayloadAction<Record<string, any>>) => {
    //   state.filters = action.payload; // Добавляем действие для установки фильтров
    // },
    resetState: () => initialState, // Добавляем действие для сброса состояния
  },
});

export const {
  setPage,
  setPageSize,
  setSearch,
  setSort,
  //   setFilters,
  resetState,
} = companiesSlice.actions;

export const companiesReducer = companiesSlice.reducer;

export const companiesSelector = createSelector(
  (state: RootState) => state.companies,
  (companies) => companies
);
