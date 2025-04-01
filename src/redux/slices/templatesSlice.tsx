import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface TemplaesState {
  company: string;
  search: string;
  page: number;
  page_size: number;
}

const initialState: TemplaesState = {
  company: "",
  search: "",
  page: 1,
  page_size: 100,
};

export const TemplatesSlice = createSlice({
  name: "templates",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.page_size = action.payload;
      state.page = 1;
    },
    setSearchCompany: (state, action: PayloadAction<string>) => {
      state.company = action.payload;
      state.page = 1;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },
    resetState: () => initialState, // Добавляем действие для сброса состояния
  },
});

export const { setPage, setPageSize, setSearchCompany, setSearch } =
  TemplatesSlice.actions;

export const templatesReducer = TemplatesSlice.reducer;

export const templatesSelector = createSelector(
  (state: RootState) => state.templates,
  (templates) => templates
);
