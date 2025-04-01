import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface LegalEntitiesState {
  currentPage: number;
  pageSize: number;
  searchCompany: string;
  searchEntityType: string;
}

const initialState: LegalEntitiesState = {
  currentPage: 1,
  pageSize: 10,
  searchCompany: "",
  searchEntityType: "",
};

export const legalEntitiesSlice = createSlice({
  name: "legal_entities",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    setSearchCompany: (state, action: PayloadAction<string>) => {
      state.searchCompany = action.payload;
      state.currentPage = 1;
    },
    setSearchEntityType: (state, action: PayloadAction<string>) => {
      state.searchEntityType = action.payload;
      state.currentPage = 1;
    },
    resetState: () => initialState, // Добавляем действие для сброса состояния
  },
});

export const { setPage, setPageSize, setSearchCompany, setSearchEntityType } =
  legalEntitiesSlice.actions;

export const legalEntitiesReducer = legalEntitiesSlice.reducer;

export const legalEntitiesSelector = createSelector(
  (state: RootState) => state.legalEntities,
  (legalEntities) => legalEntities
);
