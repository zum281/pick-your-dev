import type { FeFrameworkKey } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const BASE_SCORE = 1500;
const SCORE_INCREMENT = 50;

const initialState: {
  scores: Record<FeFrameworkKey, number>;
  history: [];
  currentRound: number;
} = {
  scores: {
    alpine: BASE_SCORE,
    angular: BASE_SCORE,
    astro: BASE_SCORE,
    fresh: BASE_SCORE,
    gatsby: BASE_SCORE,
    lit: BASE_SCORE,
    nextjs: BASE_SCORE,
    nuxtjs: BASE_SCORE,
    qwik: BASE_SCORE,
    react: BASE_SCORE,
    remix: BASE_SCORE,
    solidjs: BASE_SCORE,
    svelte: BASE_SCORE,
    sveltekit: BASE_SCORE,
    vue: BASE_SCORE,
  },
  history: [], // start empty
  currentRound: 0,
};

export const scoresSlice = createSlice({
  name: "scores",
  initialState,
  reducers: {
    winMatch: (state, action: PayloadAction<FeFrameworkKey>) => {
      state.scores[action.payload] += SCORE_INCREMENT;
    },
    loseMatch: (state, action: PayloadAction<FeFrameworkKey>) => {
      state.scores[action.payload] -= SCORE_INCREMENT;
    },
  },
});

export const { winMatch, loseMatch } = scoresSlice.actions;
export const scoresReducer = scoresSlice.reducer;
