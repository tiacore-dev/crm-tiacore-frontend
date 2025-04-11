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
  page_size: 10,
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
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },
    setCompany: (state, action: PayloadAction<string>) => {
      state.company = action.payload;
      state.page = 1;
    },
    resetState: () => initialState, // Добавляем действие для сброса состояния
  },
});

export const { setPage, setPageSize, setCompany, setSearch, resetState } =
  TemplatesSlice.actions;

export const templatesReducer = TemplatesSlice.reducer;

export const templatesSelector = createSelector(
  (state: RootState) => state.templates,
  (templates) => templates
);

// templatesSlice.ts
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface TemplatesState {
//   page: number;
//   page_size: number;
//   search: string;
//   company: string;
// }

// const initialState: TemplatesState = {
//   page: 1,
//   page_size: 10,
//   search: "",
//   company: "",
// };

// const templatesSlice = createSlice({
//   name: "templates",
//   initialState,
//   reducers: {
//     setPage: (state, action: PayloadAction<number>) => {
//       state.page = action.payload;
//     },
//     setPageSize: (state, action: PayloadAction<number>) => {
//       state.page_size = action.payload;
//     },
//     setSearch: (state, action: PayloadAction<string>) => {
//       state.search = action.payload;
//       state.page = 1;
//     },
//     setCompany: (state, action: PayloadAction<string>) => {
//       state.company = action.payload;
//       state.page = 1;
//     },
//   },
// });

// export const {
//   setPage,
//   setPageSize,
//   setSearch,
//   setCompany,
// } = templatesSlice.actions;

// export const templatesSelector = (state: any) => state.templates;

// export default templatesSlice.reducer;
