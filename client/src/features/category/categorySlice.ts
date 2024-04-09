import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
  category: string;
  page: number;
  totalPages: number;
}

const initialState: CategoryState = {
  category: "",
  page: 0,
  totalPages: 1,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<string>) {
      state.page = 0;
      state.category = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setTotalPages(state, action: PayloadAction<number>) {
      state.totalPages = action.payload;
    }
  },
});

export const { setCategory, setPage, setTotalPages } = categorySlice.actions;
export default categorySlice.reducer;
