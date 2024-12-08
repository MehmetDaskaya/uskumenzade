import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCategories,
  createCategory,
  updateCategoryApi,
  deleteCategoryApi,
} from "@/app/api/category/categoryApi";

interface Category {
  id: string;
  name: string;
}

interface CategoryState {
  categories: Category[];
  selectedCategories: Category[]; // Add this line
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  selectedCategories: [], // Initialize the selectedCategories property
  loading: false,
  error: null,
};

// Async actions
export const loadCategories = createAsyncThunk(
  "categories/loadCategories",
  async () => {
    return await fetchCategories();
  }
);

export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async ({ name }: { name: string }) => {
    return await createCategory(name);
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, name }: { id: string; name: string }) => {
    return await updateCategoryApi(id, name);
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id: string) => {
    await deleteCategoryApi(id);
    return id;
  }
);

// Slice
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setSelectedCategories(state, action) {
      // Add selected categories to the Redux state
      state.selectedCategories = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(loadCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load categories";
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (cat) => cat.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (cat) => cat.id !== action.payload
        );
      });
  },
});

export const { setSelectedCategories } = categorySlice.actions;

export default categorySlice.reducer;
