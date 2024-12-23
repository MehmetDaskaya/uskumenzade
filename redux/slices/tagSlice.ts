import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchTags,
  createTag,
  updateTag,
  deleteTag,
} from "@/app/api/tag/tagApi";

interface Tag {
  id: string;
  name: string;
}

interface TagState {
  tags: Tag[];
  loading: boolean;
  error: string | null;
}

const initialState: TagState = {
  tags: [],
  loading: false,
  error: null,
};

// Thunks
export const loadTags = createAsyncThunk<Tag[]>("tags/loadTags", async () => {
  return await fetchTags();
});

export const addTag = createAsyncThunk<Tag, string>(
  "tags/addTag",
  async (name) => {
    return await createTag(name);
  }
);

export const editTag = createAsyncThunk<Tag, { tagId: string; name: string }>(
  "tags/editTag",
  async ({ tagId, name }) => {
    return await updateTag(tagId, name);
  }
);

export const removeTag = createAsyncThunk<string, string>(
  "tags/removeTag",
  async (tagId) => {
    await deleteTag(tagId);
    return tagId;
  }
);

// Slice
const tagSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload;
      })
      .addCase(loadTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load tags";
      })
      .addCase(addTag.fulfilled, (state, action) => {
        state.tags.push(action.payload);
      })
      .addCase(editTag.fulfilled, (state, action) => {
        const index = state.tags.findIndex(
          (tag) => tag.id === action.payload.id
        );
        if (index !== -1) state.tags[index] = action.payload;
      })
      .addCase(removeTag.fulfilled, (state, action) => {
        state.tags = state.tags.filter((tag) => tag.id !== action.payload);
      });
  },
});

export default tagSlice.reducer;
