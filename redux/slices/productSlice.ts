import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/app/api/product/productApi";

// Define the shape of a product
export interface Product {
  images: any;
  id: string;
  name: string;
  description: string;
  price: number;
  discounted_price: number;
  stock: number;
  how_to_use: string;
  category_id: string;
  image_ids: string[];
}

// Define the ProductState type
interface ProductState {
  products: Product[]; // Array of products
  product: Product | null; // Single product
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
  Product[], // Return type (list of products)
  void, // Argument type (none in this case)
  { rejectValue: string } // Rejected value type
>("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    return await getProducts();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return rejectWithValue(errorMessage || "Failed to fetch products");
  }
});

export const fetchProductById = createAsyncThunk<
  Product, // Return type (single product)
  string, // Argument type (product ID)
  { rejectValue: string } // Rejected value type
>("products/fetchProductById", async (id, { rejectWithValue }) => {
  try {
    return await getProductById(id);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return rejectWithValue(errorMessage || "Failed to fetch product");
  }
});

export const addProduct = createAsyncThunk<
  Product, // Return type (newly added product)
  Omit<Product, "id">, // Argument type (product data without ID)
  { rejectValue: string } // Rejected value type
>("products/addProduct", async (productData, { rejectWithValue }) => {
  try {
    return await createProduct(productData);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return rejectWithValue(errorMessage || "Failed to add product");
  }
});

export const editProduct = createAsyncThunk<
  Product, // Return type (updated product)
  { id: string; productData: Omit<Product, "id"> }, // Argument type (ID and product data)
  { rejectValue: string } // Rejected value type
>("products/editProduct", async ({ id, productData }, { rejectWithValue }) => {
  try {
    return await updateProduct(id, productData);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return rejectWithValue(errorMessage || "Failed to update product");
  }
});

export const deleteProductById = createAsyncThunk<
  void, // Return type (no data returned)
  string, // Argument type (product ID)
  { rejectValue: string } // Rejected value type
>("products/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    await deleteProduct(id);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return rejectWithValue(errorMessage || "Failed to delete product");
  }
});

// Slice
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
