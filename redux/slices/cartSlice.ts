import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of a cart item
export interface CartItem {
  id: string;
  name: string;
  price: number;
  discounted_price: number;
  imageUrl: string;
  stock: number;
  quantity: number;
}

// Define the CartState type
interface CartState {
  items: CartItem[]; // Array of cart items
  totalQuantity: number; // Total number of items in the cart
  totalPrice: number; // Total price of the cart
}

// Initial state
const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

// Utility function to calculate totals
const calculateTotals = (items: CartItem[]) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.quantity * item.discounted_price,
    0
  );
  return { totalQuantity, totalPrice };
};

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add an item to the cart
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        // If the item is already in the cart, increase its quantity
        existingItem.quantity += action.payload.quantity;
      } else {
        // Otherwise, add it as a new item
        state.items.push(action.payload);
      }

      // Recalculate totals
      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
    },

    // Remove an item from the cart
    removeItemFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);

      // Recalculate totals
      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
    },

    // Update the quantity of an item in the cart
    updateItemQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        const newQuantity = action.payload.quantity;
        if (newQuantity > 0 && newQuantity <= item.stock) {
          item.quantity = newQuantity;
        }
      }
    },

    // Clear the cart
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

// Export actions
export const {
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  clearCart,
} = cartSlice.actions;

// Export the reducer
export default cartSlice.reducer;
