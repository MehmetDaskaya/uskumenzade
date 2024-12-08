// redux/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string | null;
  fname: string | null;
  lname: string | null;
  email: string | null;
  role: string | null;
}

const initialState: UserState = {
  id: null,
  fname: null,
  lname: null,
  email: null,
  role: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      const { id, fname, lname, email, role } = action.payload;
      state.id = id;
      state.fname = fname;
      state.lname = lname;
      state.email = email;
      state.role = role;
    },
    clearUser(state) {
      state.id = null;
      state.fname = null;
      state.lname = null;
      state.email = null;
      state.role = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
