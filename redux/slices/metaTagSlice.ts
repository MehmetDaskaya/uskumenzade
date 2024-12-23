import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchMetaTags,
  createMetaTag,
  updateMetaTag,
  deleteMetaTag,
} from "../../app/api/metaTag/metaTagApi";

interface MetaTag {
  id: string;
  name: string;
}

interface MetaTagState {
  metaTags: MetaTag[];
  loading: boolean;
  error: string | null;
}

const initialState: MetaTagState = {
  metaTags: [],
  loading: false,
  error: null,
};

// Thunks
export const loadMetaTags = createAsyncThunk<MetaTag[]>(
  "metaTags/loadMetaTags",
  async () => {
    return await fetchMetaTags();
  }
);

export const addMetaTag = createAsyncThunk<MetaTag, string>(
  "metaTags/addMetaTag",
  async (name) => {
    return await createMetaTag(name);
  }
);

export const editMetaTag = createAsyncThunk<
  MetaTag,
  { metaTagId: string; name: string }
>("metaTags/editMetaTag", async ({ metaTagId, name }) => {
  return await updateMetaTag(metaTagId, name);
});

export const removeMetaTag = createAsyncThunk<string, string>(
  "metaTags/removeMetaTag",
  async (metaTagId) => {
    await deleteMetaTag(metaTagId);
    return metaTagId;
  }
);

// Slice
const metaTagSlice = createSlice({
  name: "metaTags",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadMetaTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMetaTags.fulfilled, (state, action) => {
        state.loading = false;
        state.metaTags = action.payload;
      })
      .addCase(loadMetaTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load meta-tags";
      })
      .addCase(addMetaTag.fulfilled, (state, action) => {
        state.metaTags.push(action.payload);
      })
      .addCase(editMetaTag.fulfilled, (state, action) => {
        const index = state.metaTags.findIndex(
          (metaTag) => metaTag.id === action.payload.id
        );
        if (index !== -1) state.metaTags[index] = action.payload;
      })
      .addCase(removeMetaTag.fulfilled, (state, action) => {
        state.metaTags = state.metaTags.filter(
          (metaTag) => metaTag.id !== action.payload
        );
      });
  },
});

export default metaTagSlice.reducer;
