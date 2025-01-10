import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const isBrowser = typeof window !== "undefined";

// Helper function to get user-specific cart key
const getCartKey = (userId: string | null) =>
  userId ? `cart_${userId}` : "cart";

const loadFromLocalStorage = (userId: string | null) => {
  if (!isBrowser) return undefined; // Ensure it runs only on the client
  try {
    const cartKey = getCartKey(userId);
    const serializedState = localStorage.getItem(cartKey);
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (e) {
    console.error("Could not load cart from localStorage:", e);
    return undefined;
  }
};

const saveToLocalStorage = (state: CartState, userId: string | null) => {
  if (!isBrowser) return; // Ensure it runs only on the client
  try {
    const cartKey = getCartKey(userId);
    const serializedState = JSON.stringify(state);
    localStorage.setItem(cartKey, serializedState);
  } catch (e) {
    console.error("Could not save cart to localStorage:", e);
  }
};

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
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

// Load initial state from localStorage or default to empty
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
    loadCartForUser: (state, action: PayloadAction<string | null>) => {
      // Load cart for the current user
      const userId = action.payload;
      const loadedState = loadFromLocalStorage(userId);
      if (loadedState) {
        state.items = loadedState.items;
        state.totalQuantity = loadedState.totalQuantity;
        state.totalPrice = loadedState.totalPrice;
      } else {
        state.items = [];
        state.totalQuantity = 0;
        state.totalPrice = 0;
      }
    },

    addItemToCart: (
      state,
      action: PayloadAction<{ userId: string | null; item: CartItem }>
    ) => {
      const { userId, item } = action.payload;
      const existingItem = state.items.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.items.push(item);
      }

      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;

      saveToLocalStorage(state, userId); // Save to localStorage
    },

    updateItemQuantity: (
      state,
      action: PayloadAction<{
        userId: string | null;
        id: string;
        quantity: number;
      }>
    ) => {
      const { userId, id, quantity } = action.payload;

      // Find the item in the cart
      const item = state.items.find((cartItem) => cartItem.id === id);
      if (item) {
        const newQuantity = quantity;
        if (newQuantity > 0 && newQuantity <= item.stock) {
          item.quantity = newQuantity;
        }
      }

      // Recalculate totals
      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;

      // Save to localStorage (user-specific)
      if (userId) {
        saveToLocalStorage(state, userId);
      }
    },

    removeItemFromCart: (
      state,
      action: PayloadAction<{ userId: string | null; id: string }>
    ) => {
      const { userId, id } = action.payload;
      state.items = state.items.filter((item) => item.id !== id);

      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;

      saveToLocalStorage(state, userId); // Save to localStorage
    },

    clearCart: (state, action: PayloadAction<string | null>) => {
      const userId = action.payload;
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;

      saveToLocalStorage(state, userId); // Save to localStorage
    },

    clearCartOnSuccess: (state, action: PayloadAction<string | null>) => {
      const userId = action.payload;
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;

      saveToLocalStorage(state, userId); // Clear cart in localStorage
    },
  },
});

// Export actions
export const {
  loadCartForUser,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
  clearCartOnSuccess,
} = cartSlice.actions;

// Export the reducer
export default cartSlice.reducer;
