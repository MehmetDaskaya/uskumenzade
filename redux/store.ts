import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import productReducer from "./slices/productSlice";
import imageReducer from "./slices/imageSlice";
import categoryReducer from "./slices/categorySlice";
import cartReducer from "./slices/cartSlice";
import benefitsReducer from "./slices/benefitsSlice";
import tagReducer from "./slices/tagSlice";
import metaTagReducer from "./slices/metaTagSlice";
import orderReducer from "./slices/orderSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    product: productReducer,
    image: imageReducer,
    category: categoryReducer,
    cart: cartReducer,
    benefits: benefitsReducer,
    tags: tagReducer,
    metaTag: metaTagReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
