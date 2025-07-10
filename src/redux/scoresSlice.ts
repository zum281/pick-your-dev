import { BASE_SCORE } from "@/config";
import type { FeFrameworkKey, MatchHistory } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  scores: Record<FeFrameworkKey, number>;
  history: MatchHistory[];
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
    winMatch: (
      state,
      action: PayloadAction<{ framework: FeFrameworkKey; scoreChange: number }>,
    ) => {
      state.scores[action.payload.framework] += action.payload.scoreChange;
    },
    loseMatch: (
      state,
      action: PayloadAction<{ framework: FeFrameworkKey; scoreChange: number }>,
    ) => {
      state.scores[action.payload.framework] += action.payload.scoreChange;
    },
    updateCurrentRound: (state) => {
      state.currentRound += 1;
    },
    updateHistory: (state, action: PayloadAction<MatchHistory>) => {
      state.history.push(action.payload);
    },
    resetGame: () => initialState,
  },
});

export const {
  winMatch,
  loseMatch,
  updateCurrentRound,
  updateHistory,
  resetGame,
} = scoresSlice.actions;
export const scoresReducer = scoresSlice.reducer;
