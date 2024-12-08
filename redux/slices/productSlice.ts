import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/app/api/product/productApi";

// Define the initial state type
interface ProductState {
  products: any[]; // Array of products
  product: any | null; // Single product
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ProductState = {
  products: [],
  product: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchProducts = createAsyncThunk<
  any[], // Return type (list of products)
  void, // Argument type (none in this case)
  { rejectValue: string } // Rejected value type
>("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    return await getProducts();
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch products");
  }
});

export const fetchProductById = createAsyncThunk<
  any, // Return type (single product)
  string, // Argument type (product ID)
  { rejectValue: string } // Rejected value type
>("products/fetchProductById", async (id, { rejectWithValue }) => {
  try {
    return await getProductById(id);
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch product");
  }
});

export const addProduct = createAsyncThunk<
  any, // Return type (newly added product)
  any, // Argument type (product data to add)
  { rejectValue: string } // Rejected value type
>("products/addProduct", async (productData, { rejectWithValue }) => {
  try {
    return await createProduct(productData);
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to add product");
  }
});

export const editProduct = createAsyncThunk<
  any, // Return type (updated product)
  { id: string; productData: any }, // Argument type (ID and product data)
  { rejectValue: string } // Rejected value type
>("products/editProduct", async ({ id, productData }, { rejectWithValue }) => {
  try {
    return await updateProduct(id, productData);
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to update product");
  }
});

export const deleteProductById = createAsyncThunk<
  void, // Return type (no data returned)
  string, // Argument type (product ID)
  { rejectValue: string } // Rejected value type
>("products/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    await deleteProduct(id);
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete product");
  }
});

// Slice
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error occurred";
      })

      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error occurred";
      })

      // Add product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error occurred";
      })

      // Edit product
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error occurred";
      })

      // Delete product
      .addCase(deleteProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product.id !== action.meta.arg
        );
      })
      .addCase(deleteProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error occurred";
      });
  },
});

// Export the reducer
export default productSlice.reducer;
