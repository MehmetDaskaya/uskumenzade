import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getHealthBenefits,
  getHealthBenefitById,
  createHealthBenefit,
  updateHealthBenefit,
  deleteHealthBenefit,
} from "@/app/api/benefits/benefitsApi";

// Define the shape of a health benefit
export interface HealthBenefit {
  id: string;
  item_id: string;
  benefit: string;
  created_at: string;
  updated_at: string;
}

// Define the HealthBenefitState type
interface HealthBenefitState {
  benefits: HealthBenefit[];
  benefit: HealthBenefit | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: HealthBenefitState = {
  benefits: [],
  benefit: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchHealthBenefits = createAsyncThunk<
  HealthBenefit[],
  { offset: number; limit: number },
  { rejectValue: string }
>(
  "healthBenefits/fetchHealthBenefits",
  async ({ offset, limit }, { rejectWithValue }) => {
    try {
      return await getHealthBenefits(offset, limit);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchHealthBenefitById = createAsyncThunk<
  HealthBenefit,
  string,
  { rejectValue: string }
>("healthBenefits/fetchHealthBenefitById", async (id, { rejectWithValue }) => {
  try {
    return await getHealthBenefitById(id);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return rejectWithValue(errorMessage);
  }
});

export const addHealthBenefit = createAsyncThunk<
  HealthBenefit,
  { item_id: string; benefit: string },
  { rejectValue: string }
>(
  "healthBenefits/addHealthBenefit",
  async (benefitData, { rejectWithValue }) => {
    try {
      return await createHealthBenefit(benefitData);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return rejectWithValue(errorMessage);
    }
  }
);

export const editHealthBenefit = createAsyncThunk<
  HealthBenefit,
  { id: string; benefitData: { item_id: string; benefit: string } },
  { rejectValue: string }
>(
  "healthBenefits/editHealthBenefit",
  async ({ id, benefitData }, { rejectWithValue }) => {
    try {
      return await updateHealthBenefit(id, benefitData);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteHealthBenefitById = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("healthBenefits/deleteHealthBenefitById", async (id, { rejectWithValue }) => {
  try {
    await deleteHealthBenefit(id);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return rejectWithValue(errorMessage);
  }
});

// Slice
const healthBenefitSlice = createSlice({
  name: "healthBenefits",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHealthBenefits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHealthBenefits.fulfilled, (state, action) => {
        state.loading = false;
        state.benefits = action.payload;
      })
      .addCase(fetchHealthBenefits.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Sağlık faydalarını çekerken bir hata oluştu.";
      })

      .addCase(fetchHealthBenefitById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHealthBenefitById.fulfilled, (state, action) => {
        state.loading = false;
        state.benefit = action.payload;
      })
      .addCase(fetchHealthBenefitById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Belirli bir sağlık faydasını çekerken bir hata oluştu.";
      })

      .addCase(addHealthBenefit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addHealthBenefit.fulfilled, (state, action) => {
        state.loading = false;
        state.benefits.push(action.payload);
      })
      .addCase(addHealthBenefit.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Sağlık faydası eklerken bir hata oluştu.";
      })

      .addCase(editHealthBenefit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editHealthBenefit.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.benefits.findIndex(
          (benefit) => benefit.id === action.payload.id
        );
        if (index !== -1) {
          state.benefits[index] = action.payload;
        }
      })
      .addCase(editHealthBenefit.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Sağlık faydasını düzenlerken bir hata oluştu.";
      })

      .addCase(deleteHealthBenefitById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHealthBenefitById.fulfilled, (state, action) => {
        state.loading = false;
        state.benefits = state.benefits.filter(
          (benefit) => benefit.id !== action.meta.arg
        );
      })
      .addCase(deleteHealthBenefitById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Sağlık faydasını silerken bir hata oluştu.";
      });
  },
});

// Export the reducer
export default healthBenefitSlice.reducer;
