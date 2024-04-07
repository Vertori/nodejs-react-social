import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
  category: string;
  page: number;
}

const initialState: CategoryState = {
  category: "",
  page: 0,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
      state.page = 0;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
});

export const { setCategory, setPage } = categorySlice.actions;
export default categorySlice.reducer;
