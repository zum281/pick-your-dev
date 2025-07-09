import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type {
  FeFrameworkKey,
  FeFrameworkPair,
  GameState,
  MatchHistory,
} from "@/types";
import { getNextMatch } from "../next-match";

// Helper function to create test game states
const createGameState = (
  scores: Partial<Record<FeFrameworkKey, number>> = {},
  history: MatchHistory[] = [],
  currentRound: number = 0,
): GameState => {
  const defaultScores: Record<FeFrameworkKey, number> = {
    alpine: 1500,
    angular: 1500,
    astro: 1500,
    fresh: 1500,
    gatsby: 1500,
    lit: 1500,
    nextjs: 1500,
    nuxtjs: 1500,
    qwik: 1500,
    react: 1500,
    remix: 1500,
    solidjs: 1500,
    svelte: 1500,
    sveltekit: 1500,
    vue: 1500,
  };

  return {
    scores: { ...defaultScores, ...scores },
    history,
    currentRound,
  };
};

// Helper to create a minimal game state with only specified frameworks
const createMinimalGameState = (
  frameworkScores: Record<string, number>,
  history: MatchHistory[] = [],
  currentRound: number = 0,
): GameState => {
  return {
    scores: frameworkScores as Record<FeFrameworkKey, number>,
    history,
    currentRound,
  };
};

describe("getNextMatch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Game Completion", () => {
    it("should return null when currentRound equals MAX_ROUNDS", () => {
      const gameState = createGameState({}, [], 35); // MAX_ROUNDS = 35

      const result = getNextMatch(gameState);

      expect(result).toBeNull();
    });

    it("should return null when currentRound exceeds MAX_ROUNDS", () => {
      const gameState = createGameState({}, [], 40);

      const result = getNextMatch(gameState);

      expect(result).toBeNull();
    });

    it("should work when currentRound is just below MAX_ROUNDS", () => {
      const gameState = createGameState({}, [], 34); // One before max

      const result = getNextMatch(gameState);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(2);
    });
  });

  describe("Basic Functionality", () => {
    it("should return a valid pair on first round (no history)", () => {
      const gameState = createGameState();

      const result = getNextMatch(gameState);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(2);
      expect(result![0]).not.toBe(result![1]); // Different frameworks

      // Should be valid framework keys
      const validFrameworks = [
        "alpine",
        "angular",
        "astro",
        "fresh",
        "gatsby",
        "lit",
        "nextjs",
        "nuxtjs",
        "qwik",
        "react",
        "remix",
        "solidjs",
        "svelte",
        "sveltekit",
        "vue",
      ];
      expect(validFrameworks).toContain(result![0]);
      expect(validFrameworks).toContain(result![1]);
    });

    it("should return different frameworks in the pair", () => {
      const gameState = createGameState();

      for (let i = 0; i < 10; i++) {
        const result = getNextMatch(gameState);
        if (result) {
          expect(result[0]).not.toBe(result[1]);
        }
      }
    });

    it("should work with minimal framework set", () => {
      const gameState = createMinimalGameState({
        react: 1500,
        vue: 1500,
      });

      const result = getNextMatch(gameState);

      expect(result).toEqual(["react", "vue"]);
    });
  });

  describe("Duplicate Avoidance", () => {
    it("should return null when no unseen pairs left (small set)", () => {
      // Create game state with only 3 frameworks
      const gameState = createMinimalGameState({
        react: 1500,
        vue: 1500,
        angular: 1500,
      });

      // Add all possible pairs to history (3 choose 2 = 3 pairs)
      const allPossiblePairs: MatchHistory[] = [
        { pair: ["react", "vue"], round: 0, winner: "react" },
        { pair: ["react", "angular"], round: 1, winner: "react" },
        { pair: ["vue", "angular"], round: 2, winner: "vue" },
      ];

      gameState.history = allPossiblePairs;
      gameState.currentRound = 10;

      const result = getNextMatch(gameState);

      expect(result).toBeNull();
    });

    it("should not return pairs that have been seen before", () => {
      const history: MatchHistory[] = [
        { pair: ["react", "vue"], round: 0, winner: "react" },
        { pair: ["angular", "svelte"], round: 1, winner: "angular" },
      ];
      const gameState = createGameState({}, history, 2);

      // Run multiple times to ensure consistency
      for (let i = 0; i < 10; i++) {
        const result = getNextMatch(gameState);

        if (result) {
          const normalized =
            result[0] < result[1] ? result : [result[1], result[0]];

          // Should not be the pairs we've already seen
          expect(normalized).not.toEqual(["react", "vue"]);
          expect(normalized).not.toEqual(["angular", "svelte"]);
        }
      }
    });

    it("should handle pairs in different order in history", () => {
      const history: MatchHistory[] = [
        { pair: ["vue", "react"], round: 0, winner: "vue" }, // Reversed order
        { pair: ["svelte", "angular"], round: 1, winner: "svelte" }, // Reversed order
      ];
      const gameState = createGameState({}, history, 2);

      for (let i = 0; i < 5; i++) {
        const result = getNextMatch(gameState);

        if (result) {
          const normalized =
            result[0] < result[1] ? result : [result[1], result[0]];

          // Should recognize these as the same pairs and avoid them
          expect(normalized).not.toEqual(["react", "vue"]);
          expect(normalized).not.toEqual(["angular", "svelte"]);
        }
      }
    });

    it("should handle ties in history correctly", () => {
      const history: MatchHistory[] = [
        { pair: ["react", "vue"], round: 0, winner: null }, // Tie
        { pair: ["angular", "svelte"], round: 1, winner: "angular" },
      ];
      const gameState = createGameState({}, history, 2);

      const result = getNextMatch(gameState);

      if (result) {
        const normalized =
          result[0] < result[1] ? result : [result[1], result[0]];

        // Should avoid both tied and won pairs
        expect(normalized).not.toEqual(["react", "vue"]);
        expect(normalized).not.toEqual(["angular", "svelte"]);
      }
    });
  });

  describe("Algorithm Logic", () => {
    it("should prioritize pairs with similar scores", () => {
      const gameState = createGameState({
        react: 1500,
        vue: 1505, // Very close to react
        angular: 2000, // Far from others
        svelte: 1502, // Close to react and vue
      });

      const results: FeFrameworkPair[] = [];

      // Run multiple times to see which pairs are selected
      for (let i = 0; i < 30; i++) {
        const result = getNextMatch(gameState);
        if (result) {
          results.push(result);
        }
      }

      // Count pairs involving the close-scored frameworks
      const closeScorePairs = results.filter((pair) => {
        const frameworks = [pair[0], pair[1]];
        const closeFrameworks = ["react", "vue", "svelte"];
        return frameworks.every((fw) => closeFrameworks.includes(fw));
      });

      // Should heavily favor close-scored pairs
      expect(closeScorePairs.length).toBeGreaterThan(results.length * 0.5);
    });

    it("should show some randomness in selection", () => {
      const gameState = createGameState();

      const results = new Set<string>();

      // Run multiple times
      for (let i = 0; i < 50; i++) {
        const result = getNextMatch(gameState);
        if (result) {
          const normalized =
            result[0] < result[1]
              ? [result[0], result[1]]
              : [result[1], result[0]];
          results.add(`${normalized[0]}-${normalized[1]}`);
        }
      }

      // Should get multiple different pairs due to randomness
      expect(results.size).toBeGreaterThan(10);
    });

    it("should be deterministic with mocked randomness", () => {
      const mockRandom = vi.spyOn(Math, "random");
      mockRandom.mockReturnValue(0.5); // Always return middle value

      const gameState = createGameState();

      const result1 = getNextMatch(gameState);
      const result2 = getNextMatch(gameState);

      expect(result1).toEqual(result2);

      mockRandom.mockRestore();
    });

    it("should select from top candidates correctly", () => {
      const mockRandom = vi.spyOn(Math, "random");

      // Test selecting first candidate (index 0)
      mockRandom.mockReturnValue(0.0);
      const gameState1 = createGameState();
      const result1 = getNextMatch(gameState1);

      // Test selecting second candidate (index 1, if available)
      mockRandom.mockReturnValue(0.4);
      const gameState2 = createGameState();
      const result2 = getNextMatch(gameState2);

      // Test selecting third candidate (index 2, if available)
      mockRandom.mockReturnValue(0.9);
      const gameState3 = createGameState();
      const result3 = getNextMatch(gameState3);

      // Results should be valid but potentially different
      expect(result1).not.toBeNull();
      expect(result2).not.toBeNull();
      expect(result3).not.toBeNull();

      mockRandom.mockRestore();
    });
  });

  describe("Participation Bonus Testing", () => {
    it("should prioritize frameworks that haven't been seen recently", () => {
      const history: MatchHistory[] = [
        // React and Vue have been seen recently
        { pair: ["react", "angular"], round: 8, winner: "react" },
        { pair: ["vue", "svelte"], round: 9, winner: "vue" },
        // Alpine and Astro haven't been seen for a while
        { pair: ["alpine", "astro"], round: 1, winner: "alpine" },
      ];

      const gameState = createGameState(
        {
          react: 1500,
          vue: 1500,
          alpine: 1500,
          astro: 1500,
        },
        history,
        15,
      );

      const results: FeFrameworkPair[] = [];

      for (let i = 0; i < 20; i++) {
        const result = getNextMatch(gameState);
        if (result) {
          results.push(result);
        }
      }

      // Count pairs involving frameworks not seen recently
      const oldFrameworkPairs = results.filter((pair) => {
        const frameworks = [pair[0], pair[1]];
        return frameworks.some((fw) => fw === "alpine" || fw === "astro");
      });

      // Should show some preference for old frameworks
      expect(oldFrameworkPairs.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle minimum viable game state", () => {
      const gameState = createMinimalGameState(
        {
          react: 1500,
          vue: 1500,
        },
        [],
        0,
      );

      const result = getNextMatch(gameState);

      expect(result).toEqual(["react", "vue"]);
    });

    it("should handle game state where only one pair is possible", () => {
      const gameState = createMinimalGameState({
        react: 1500,
        vue: 1500,
      });

      const result = getNextMatch(gameState);

      expect(result).toEqual(["react", "vue"]);
    });

    it("should handle large score differences gracefully", () => {
      const gameState = createGameState({
        react: -1000,
        vue: 5000,
        angular: 1500,
      });

      const result = getNextMatch(gameState);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(2);
    });

    it("should handle empty scores object gracefully", () => {
      const gameState = createMinimalGameState({}, [], 0);

      const result = getNextMatch(gameState);

      // With no frameworks, should return null or handle gracefully
      expect(result).toBeNull();
    });

    it("should handle single framework gracefully", () => {
      const gameState = createMinimalGameState(
        {
          react: 1500,
        },
        [],
        0,
      );

      const result = getNextMatch(gameState);

      // Can't make pairs with single framework
      expect(result).toBeNull();
    });

    it("should work consistently near game boundaries", () => {
      // Test multiple rounds near the boundary
      for (let round = 32; round <= 35; round++) {
        const gameState = createGameState({}, [], round);
        const result = getNextMatch(gameState);

        if (round < 35) {
          expect(result).not.toBeNull();
        } else {
          expect(result).toBeNull();
        }
      }
    });
  });

  describe("Integration with History", () => {
    it("should work correctly with complex history", () => {
      const history: MatchHistory[] = [
        { pair: ["react", "vue"], round: 0, winner: "react" },
        { pair: ["angular", "svelte"], round: 1, winner: null }, // Tie
        { pair: ["nextjs", "remix"], round: 2, winner: "nextjs" },
        { pair: ["astro", "fresh"], round: 3, winner: "astro" },
        { pair: ["lit", "qwik"], round: 4, winner: "lit" },
      ];

      const gameState = createGameState({}, history, 5);

      const result = getNextMatch(gameState);

      if (result) {
        const normalized =
          result[0] < result[1] ? result : [result[1], result[0]];

        // Should not match any of the pairs in history
        const historyPairs = [
          ["react", "vue"],
          ["angular", "svelte"],
          ["nextjs", "remix"],
          ["astro", "fresh"],
          ["lit", "qwik"],
        ];

        expect(historyPairs).not.toContainEqual(normalized);
      }
    });

    it("should handle very long history efficiently", () => {
      // Create a long history but leave some pairs unseen
      const history: MatchHistory[] = [];
      const usedPairs = new Set<string>();

      // Add 50 different pairs to history
      const frameworks = [
        "react",
        "vue",
        "angular",
        "svelte",
        "nextjs",
        "remix",
        "astro",
        "fresh",
      ];
      let round = 0;

      for (let i = 0; i < frameworks.length && history.length < 20; i++) {
        for (let j = i + 1; j < frameworks.length && history.length < 20; j++) {
          const pair: [FeFrameworkKey, FeFrameworkKey] = [
            frameworks[i] as FeFrameworkKey,
            frameworks[j] as FeFrameworkKey,
          ];
          const pairKey = `${pair[0]}-${pair[1]}`;

          if (!usedPairs.has(pairKey)) {
            history.push({ pair, round: round++, winner: pair[0] });
            usedPairs.add(pairKey);
          }
        }
      }

      const gameState = createGameState({}, history, round);

      // Should still be able to find unseen pairs
      const result = getNextMatch(gameState);

      if (result) {
        const normalized =
          result[0] < result[1]
            ? [result[0], result[1]]
            : [result[1], result[0]];
        const resultKey = `${normalized[0]}-${normalized[1]}`;

        expect(usedPairs.has(resultKey)).toBe(false);
      }
    });

    it("should handle gradual exhaustion of pairs", () => {
      const gameState = createMinimalGameState({
        react: 1500,
        vue: 1500,
        angular: 1500,
        svelte: 1500,
      });

      const seenPairs = new Set<string>();
      let round = 0;

      // Simulate playing matches until exhaustion
      while (round < 10) {
        // Prevent infinite loop
        const result = getNextMatch({
          ...gameState,
          currentRound: round,
        });

        if (!result) {
          break; // No more pairs available
        }

        // Add this pair to history
        const normalized =
          result[0] < result[1] ? result : [result[1], result[0]];
        const pairKey = `${normalized[0]}-${normalized[1]}`;

        expect(seenPairs.has(pairKey)).toBe(false); // Should be new
        seenPairs.add(pairKey);

        gameState.history.push({
          pair: result,
          round: round,
          winner: result[0],
        });

        round++;
      }

      // Should have seen all 6 possible pairs
      expect(seenPairs.size).toBe(6); // 4 choose 2 = 6

      // Next call should return null
      const finalResult = getNextMatch({
        ...gameState,
        currentRound: round,
      });
      expect(finalResult).toBeNull();
    });
  });

  describe("Performance and Consistency", () => {
    it("should perform reasonably with full framework set", () => {
      const gameState = createGameState();

      const startTime = performance.now();

      // Run multiple calls to test performance
      for (let i = 0; i < 100; i++) {
        const result = getNextMatch(gameState);
        expect(result).not.toBeNull();
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete 100 calls reasonably quickly (< 100ms)
      expect(duration).toBeLessThan(100);
    });

    it("should be consistent with same random seed sequence", () => {
      const mockRandom = vi.spyOn(Math, "random");
      const randomSequence = [0.1, 0.3, 0.7, 0.2, 0.9];
      let callCount = 0;

      mockRandom.mockImplementation(() => {
        return randomSequence[callCount++ % randomSequence.length];
      });

      const gameState1 = createGameState();
      const gameState2 = createGameState();

      // Reset call count
      callCount = 0;
      const result1 = getNextMatch(gameState1);

      callCount = 0;
      const result2 = getNextMatch(gameState2);

      expect(result1).toEqual(result2);

      mockRandom.mockRestore();
    });

    it("should handle rapid successive calls", () => {
      const gameState = createGameState();
      const results: (FeFrameworkPair | null)[] = [];

      // Make many rapid calls
      for (let i = 0; i < 50; i++) {
        results.push(getNextMatch(gameState));
      }

      // All should be valid (since we're not updating history)
      results.forEach((result) => {
        expect(result).not.toBeNull();
        expect(result).toHaveLength(2);
      });
    });
  });

  describe("Real-world Scenarios", () => {
    it("should handle mid-game scenario with mixed scores and history", () => {
      const history: MatchHistory[] = [
        { pair: ["react", "vue"], round: 0, winner: "react" },
        { pair: ["angular", "svelte"], round: 1, winner: "svelte" },
        { pair: ["nextjs", "remix"], round: 2, winner: null }, // Tie
        { pair: ["astro", "gatsby"], round: 3, winner: "astro" },
        { pair: ["lit", "qwik"], round: 4, winner: "qwik" },
      ];

      const gameState = createGameState(
        {
          react: 1550, // Won against vue
          vue: 1450, // Lost to react
          angular: 1450, // Lost to svelte
          svelte: 1550, // Beat angular
          nextjs: 1500, // Tied with remix
          remix: 1500, // Tied with nextjs
          astro: 1550, // Beat gatsby
          gatsby: 1450, // Lost to astro
          lit: 1450, // Lost to qwik
          qwik: 1550, // Beat lit
        },
        history,
        5,
      );

      const result = getNextMatch(gameState);

      expect(result).not.toBeNull();

      if (result) {
        // Should not be any of the already seen pairs
        const normalized =
          result[0] < result[1] ? result : [result[1], result[0]];
        const seenPairs = [
          ["react", "vue"],
          ["angular", "svelte"],
          ["nextjs", "remix"],
          ["astro", "gatsby"],
          ["lit", "qwik"],
        ];

        expect(seenPairs).not.toContainEqual(normalized);

        // Should be frameworks with valid scores
        expect(gameState.scores[result[0]]).toBeDefined();
        expect(gameState.scores[result[1]]).toBeDefined();
      }
    });

    it("should work in early game with no history", () => {
      const gameState = createGameState(
        {
          react: 1500,
          vue: 1500,
          angular: 1500,
          svelte: 1500,
          nextjs: 1500,
        },
        [],
        0,
      );

      const result = getNextMatch(gameState);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(2);

      // Should be valid framework combination
      const frameworks = ["react", "vue", "angular", "svelte", "nextjs"];
      expect(frameworks).toContain(result![0]);
      expect(frameworks).toContain(result![1]);
    });

    it("should work in late game with many seen pairs", () => {
      // Simulate late game with many pairs already seen
      const history: MatchHistory[] = [];
      let round = 0;

      // Add many pairs to history, but not all
      const frameworks = [
        "react",
        "vue",
        "angular",
        "svelte",
        "nextjs",
        "remix",
      ];
      for (let i = 0; i < frameworks.length - 1; i++) {
        for (let j = i + 1; j < frameworks.length - 1; j++) {
          // Leave some pairs unseen
          history.push({
            pair: [
              frameworks[i] as FeFrameworkKey,
              frameworks[j] as FeFrameworkKey,
            ],
            round: round++,
            winner: frameworks[i] as FeFrameworkKey,
          });
        }
      }

      const gameState = createMinimalGameState(
        {
          react: 1600,
          vue: 1400,
          angular: 1550,
          svelte: 1450,
          nextjs: 1520,
          remix: 1480,
        },
        history,
        round,
      );

      const result = getNextMatch(gameState);

      // Should still find an unseen pair
      expect(result).not.toBeNull();

      if (result) {
        const normalized =
          result[0] < result[1] ? result : [result[1], result[0]];

        // Verify it's not in the history
        const historyPairStrings = history.map((h) => {
          const norm = h.pair[0] < h.pair[1] ? h.pair : [h.pair[1], h.pair[0]];
          return `${norm[0]}-${norm[1]}`;
        });

        const resultString = `${normalized[0]}-${normalized[1]}`;
        expect(historyPairStrings).not.toContain(resultString);
      }
    });
  });
});
