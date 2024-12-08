import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  uploadImage,
  fetchImages,
  deleteImageApi,
} from "@/app/api/image/imageApi";

interface ImageInterface {
  path: string;
  alt_text: string;
  created_at: string | number | Date;
  image_type: string;
  id: string; // or number depending on your API
  url: string;
  type: string; // e.g., "blog" or "product"
}

interface ImageState {
  images: ImageInterface[];
  loading: boolean;
  error: string | null;
  selectedImageId: string | null; // Store selected image ID
}

const initialState: ImageState = {
  images: [],
  loading: false,
  error: null,
  selectedImageId: null, // Initialize selected image ID
};

// Async thunk to load images by type
export const loadImages = createAsyncThunk<ImageInterface[], string>(
  "images/loadImages",
  async (type) => {
    return await fetchImages(type);
  }
);

// Async thunk to add a new image
export const addImage = createAsyncThunk<
  ImageInterface,
  { file: File; alt_text: string; type: string; token: string }
>("images/addImage", async ({ file, alt_text, type, token }) => {
  return await uploadImage(file, alt_text, type, token);
});

// Async thunk to delete an image
export const deleteImage = createAsyncThunk<
  string,
  { imageId: string; token: string }
>("images/deleteImage", async ({ imageId, token }) => {
  await deleteImageApi(imageId, token);
  return imageId;
});

const imageSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    setSelectedImage: (state, action) => {
      state.selectedImageId = action.payload; // Save selected image ID
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
      })
      .addCase(loadImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load images";
      })
      .addCase(addImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addImage.fulfilled, (state, action) => {
        state.loading = false;
        state.images.push(action.payload);
      })
      .addCase(addImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to upload image";
      })
      .addCase(deleteImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.loading = false;
        state.images = state.images.filter(
          (image) => image.id !== action.payload
        );
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete image";
      });
  },
});

export const { setSelectedImage } = imageSlice.actions;
export default imageSlice.reducer;
