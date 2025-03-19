import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface UsersState {
  currentPage: number;
  pageSize: number;
  search: string;
  sortBy: string;
  order: string;
  filters: {
    username: string;
    full_name: string;
  };
}

const initialState: UsersState = {
  currentPage: 1,
  pageSize: 10,
  search: "",
  sortBy: "username",
  order: "asc",
  filters: {
    username: "",
    full_name: "",
  },};
// фильтры и пангинация на счета на бэке остальное в клиенте
export const usersSlice = createSlice({
  name: "users",
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
    setFilters(state, action: PayloadAction<{ username: string; full_name: string }>) {
      state.filters = action.payload;
    },
  },
});

export const { setPage, setPageSize, setSearch, setSort, setFilters } =
  usersSlice.actions;

export const usersReducer = usersSlice.reducer;

export const usersSelector = createSelector((state: RootState) => state.users, (users) => users)
