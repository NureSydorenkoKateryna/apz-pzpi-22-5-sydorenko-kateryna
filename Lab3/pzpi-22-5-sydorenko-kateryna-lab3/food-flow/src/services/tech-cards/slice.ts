import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import {
  createTechCard as apiCreateTechCard,
  deleteTechCard as apiDeleteTechCard,
  updateTechCard as apiUpdateTechCard,
  getTechCards,
} from '../tech-cards/api';

interface TechCardsState {
  techCards: TechCardDto[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TechCardsState = {
  techCards: [],
  isLoading: false,
  error: null,
};

export const fetchTechCards = createAsyncThunk<
  TechCardDto[],
  string // token
>('techCards/fetch', async token => {
  const response = await getTechCards(token);
  return response.techCards;
});

export const createTechCard = createAsyncThunk<
  TechCardDto,
  { token: string; data: CreateTechCardRequest }
>('techCards/create', async ({ token, data }) => {
  const created = await apiCreateTechCard(token, data);
  return created;
});

export const updateTechCard = createAsyncThunk<
  TechCardDto | null,
  { token: string; id: number; data: CreateTechCardRequest }
>('techCards/update', async ({ token, id, data }) => {
  await apiUpdateTechCard(token, id, data);
  return null;
});

export const deleteTechCard = createAsyncThunk<number, { token: string; id: number }>(
  'techCards/delete',
  async ({ token, id }) => {
    await apiDeleteTechCard(token, id);
    return id;
  }
);

const techCardsSlice = createSlice({
  name: 'techCards',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTechCards.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTechCards.fulfilled, (state, action) => {
        state.techCards = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchTechCards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Failed to fetch tech cards';
      })
      .addCase(deleteTechCard.fulfilled, (state, action) => {
        const id = action.meta.arg.id;
        state.techCards = state.techCards.filter(tc => tc.id !== id);
      });
  },
});

export const selectTechCards = (state: RootState) => state.techCards.techCards;
export const selectTechCardsLoading = (state: RootState) => state.techCards.isLoading;
export const selectTechCardsError = (state: RootState) => state.techCards.error;

export default techCardsSlice;
