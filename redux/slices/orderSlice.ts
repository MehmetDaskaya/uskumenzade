import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store"; // Adjust the path to match your project structure

import {
  fetchOrders,
  fetchOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  Order,
} from "../../app/api/order/orderApi";

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

// Helper function to extract error messages
const extractErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "An unknown error occurred";

// Thunks
export const getOrders = createAsyncThunk(
  "orders/fetchAll",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.accessToken;

      if (!token) {
        return thunkAPI.rejectWithValue("Authentication token is missing.");
      }

      return await fetchOrders(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const getOrderById = createAsyncThunk(
  "orders/fetchById",
  async (orderId: string, thunkAPI) => {
    try {
      return await fetchOrderById(orderId);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const createNewOrder = createAsyncThunk(
  "orders/create",
  async (
    {
      orderData,
      token,
    }: {
      orderData: {
        shipping_address_id: string;
        billing_address_id: string;
        basket: {
          quantity: number;
          item_id: string;
        }[];
      };
      token: string;
    },
    thunkAPI
  ) => {
    try {
      return await createOrder(orderData, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const updateExistingOrder = createAsyncThunk(
  "orders/update",
  async (
    {
      orderId,
      orderData,
      token,
    }: { orderId: string; orderData: Partial<Order>; token: string },
    thunkAPI
  ) => {
    try {
      return await updateOrder(orderId, orderData, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const deleteExistingOrder = createAsyncThunk(
  "orders/delete",
  async ({ orderId, token }: { orderId: string; token: string }, thunkAPI) => {
    try {
      await deleteOrder(orderId, token);
      return orderId;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Slice
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearSelectedOrder(state) {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Orders
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload && typeof action.payload === "string"
            ? action.payload
            : "An unknown error occurred";
      })

      // Get Order by ID
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getOrderById.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.loading = false;
          state.selectedOrder = action.payload;
        }
      )
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload && typeof action.payload === "string"
            ? action.payload
            : "An unknown error occurred";
      })

      // Create Order
      .addCase(createNewOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createNewOrder.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.loading = false;
          state.orders.push(action.payload);
        }
      )
      .addCase(createNewOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload && typeof action.payload === "string"
            ? action.payload
            : "An unknown error occurred";
      })

      // Update Order
      .addCase(updateExistingOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateExistingOrder.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.loading = false;
          state.orders = state.orders.map((order) =>
            order.id === action.payload.id ? action.payload : order
          );
        }
      )
      .addCase(updateExistingOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload && typeof action.payload === "string"
            ? action.payload
            : "An unknown error occurred";
      })

      // Delete Order
      .addCase(deleteExistingOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteExistingOrder.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.orders = state.orders.filter(
            (order) => order.id !== action.payload
          );
        }
      )
      .addCase(deleteExistingOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload && typeof action.payload === "string"
            ? action.payload
            : "An unknown error occurred";
      });
  },
});

export const { clearSelectedOrder } = orderSlice.actions;

export default orderSlice.reducer;
