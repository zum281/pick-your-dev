import { describe, it, expect } from "vitest";
import {
  scoresReducer,
  winMatch,
  loseMatch,
  updateCurrentRound,
  updateHistory,
} from "../scoresSlice";
import type { FeFrameworkKey, MatchHistory } from "@/types";

// Helper to create initial state for testing
const createInitialState = () => ({
  scores: {
    react: 1500,
    vue: 1500,
    angular: 1500,
    svelte: 1500,
  } as Record<FeFrameworkKey, number>,
  history: [] as MatchHistory[],
  currentRound: 0,
});

describe("scoresSlice", () => {
  describe("winMatch", () => {
    it("should increase winner score by the specified amount", () => {
      const initialState = createInitialState();
      const action = winMatch({ framework: "react", scoreChange: 16 });

      const newState = scoresReducer(initialState, action);

      expect(newState.scores.react).toBe(1516);
      expect(newState.scores.vue).toBe(1500); // Other scores unchanged
    });

    it("should handle large score changes", () => {
      const initialState = createInitialState();
      const action = winMatch({ framework: "react", scoreChange: 32 });

      const newState = scoresReducer(initialState, action);

      expect(newState.scores.react).toBe(1532);
    });

    it("should not mutate the original state", () => {
      const initialState = createInitialState();
      const originalReactScore = initialState.scores.react;

      scoresReducer(
        initialState,
        winMatch({ framework: "react", scoreChange: 16 }),
      );

      expect(initialState.scores.react).toBe(originalReactScore);
    });
  });

  describe("loseMatch", () => {
    it("should decrease loser score by the specified amount", () => {
      const initialState = createInitialState();
      const action = loseMatch({ framework: "vue", scoreChange: 16 });

      const newState = scoresReducer(initialState, action);

      expect(newState.scores.vue).toBe(1484);
      expect(newState.scores.react).toBe(1500); // Other scores unchanged
    });

    it("should handle scores going negative", () => {
      const initialState = createInitialState();
      initialState.scores.vue = 10; // Low score
      const action = loseMatch({ framework: "vue", scoreChange: 20 });

      const newState = scoresReducer(initialState, action);

      expect(newState.scores.vue).toBe(-10);
    });
  });

  describe("updateCurrentRound", () => {
    it("should increment current round by 1", () => {
      const initialState = createInitialState();

      const newState = scoresReducer(initialState, updateCurrentRound());

      expect(newState.currentRound).toBe(1);
    });

    it("should increment from any round number", () => {
      const initialState = createInitialState();
      initialState.currentRound = 15;

      const newState = scoresReducer(initialState, updateCurrentRound());

      expect(newState.currentRound).toBe(16);
    });
  });

  describe("updateHistory", () => {
    it("should add match to history", () => {
      const initialState = createInitialState();
      const matchup: MatchHistory = {
        pair: ["react", "vue"],
        round: 0,
        winner: "react",
      };

      const newState = scoresReducer(initialState, updateHistory(matchup));

      expect(newState.history).toHaveLength(1);
      expect(newState.history[0]).toEqual(matchup);
    });

    it("should handle ties (winner: null)", () => {
      const initialState = createInitialState();
      const matchup: MatchHistory = {
        pair: ["react", "vue"],
        round: 0,
        winner: null,
      };

      const newState = scoresReducer(initialState, updateHistory(matchup));

      expect(newState.history[0].winner).toBeNull();
    });

    it("should append to existing history", () => {
      const initialState = createInitialState();
      const firstMatch: MatchHistory = {
        pair: ["react", "vue"],
        round: 0,
        winner: "react",
      };

      let newState = scoresReducer(initialState, updateHistory(firstMatch));

      const secondMatch: MatchHistory = {
        pair: ["angular", "svelte"],
        round: 1,
        winner: "svelte",
      };

      newState = scoresReducer(newState, updateHistory(secondMatch));

      expect(newState.history).toHaveLength(2);
      expect(newState.history[1]).toEqual(secondMatch);
    });
  });
});
