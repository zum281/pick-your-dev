import { describe, it, expect } from "vitest";
import type {
  FeFrameworkKey,
  FeFrameworkPair,
  GameState,
  MatchHistory,
} from "@/types";
import { calculatePairValue } from "../next-match";

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

describe("calculatePairValue", () => {
  describe("Uncertainty Value (Score Differences)", () => {
    it("should give maximum uncertainty value for identical scores", () => {
      const gameState = createGameState({
        react: 1500,
        vue: 1500,
      });

      const value = calculatePairValue({
        pair: ["react", "vue"],
        gameState,
      });

      // uncertaintyValue = max(0, 600 - 0) = 600
      // participationBonus = min(Infinity + Infinity, 200) = 200
      expect(value).toBe(800);
    });

    it("should give high uncertainty value for very similar scores", () => {
      const gameState = createGameState({
        react: 1500,
        vue: 1505, // 5 point difference
      });

      const value = calculatePairValue({
        pair: ["react", "vue"],
        gameState,
      });

      // uncertaintyValue = max(0, 600 - 5) = 595
      // participationBonus = 200 (both never seen)
      expect(value).toBe(795);
    });

    it("should give moderate uncertainty value for medium score differences", () => {
      const gameState = createGameState({
        react: 1500,
        vue: 1600, // 100 point difference
      });

      const value = calculatePairValue({
        pair: ["react", "vue"],
        gameState,
      });

      // uncertaintyValue = max(0, 600 - 100) = 500
      // participationBonus = 200
      expect(value).toBe(700);
    });

    it("should give low uncertainty value for large score differences", () => {
      const gameState = createGameState({
        react: 1000,
        vue: 1700, // 700 point difference
      });

      const value = calculatePairValue({
        pair: ["react", "vue"],
        gameState,
      });

      // uncertaintyValue = max(0, 600 - 700) = 0
      // participationBonus = 200
      expect(value).toBe(200);
    });

    it("should give zero uncertainty value for very large differences", () => {
      const gameState = createGameState({
        react: 500,
        vue: 2500, // 2000 point difference
      });

      const value = calculatePairValue({
        pair: ["react", "vue"],
        gameState,
      });

      // uncertaintyValue = max(0, 600 - 2000) = 0
      // participationBonus = 200
      expect(value).toBe(200);
    });

    it("should handle negative scores correctly", () => {
      const gameState = createGameState({
        react: -100,
        vue: -90, // 10 point difference
      });

      const value = calculatePairValue({
        pair: ["react", "vue"],
        gameState,
      });

      // uncertaintyValue = max(0, 600 - 10) = 590
      // participationBonus = 200
      expect(value).toBe(790);
    });
  });

  describe("Participation Bonus", () => {
    it("should give maximum participation bonus for frameworks never seen", () => {
      const gameState = createGameState(
        {
          react: 1500,
          vue: 1500,
        },
        [],
        10,
      ); // No history, current round 10

      const value = calculatePairValue({
        pair: ["react", "vue"],
        gameState,
      });

      // Both frameworks return Infinity for lastSeen
      // participationBonus = min(Infinity + Infinity, 200) = 200
      expect(value).toBeGreaterThanOrEqual(200);
    });

    it("should calculate participation bonus for frameworks seen recently", () => {
      const history: MatchHistory[] = [
        { pair: ["react", "angular"], round: 2, winner: "react" }, // React last seen 8 rounds ago
        { pair: ["vue", "svelte"], round: 5, winner: "vue" }, // Vue last seen 5 rounds ago
      ];
      const gameState = createGameState(
        {
          react: 1500,
          vue: 1500,
        },
        history,
        10,
      );

      const value = calculatePairValue({
        pair: ["react", "vue"],
        gameState,
      });

      // aLastSeen = 10 - 2 = 8, bLastSeen = 10 - 5 = 5
      // participationBonus = min(8 + 5, 200) = 13
      // uncertaintyValue = 600
      expect(value).toBe(613);
    });

    it("should cap participation bonus at 200", () => {
      const history: MatchHistory[] = [
        { pair: ["react", "angular"], round: 0, winner: "react" }, // React last seen 150 rounds ago
        { pair: ["vue", "svelte"], round: 0, winner: "vue" }, // Vue last seen 150 rounds ago
      ];
      const gameState = createGameState(
        {
          react: 1500,
          vue: 1500,
        },
        history,
        150,
      );

      const value = calculatePairValue({
        pair: ["react", "vue"],
        gameState,
      });

      // aLastSeen = 150, bLastSeen = 150
      // participationBonus = min(150 + 150, 200) = 200 (capped)
      // uncertaintyValue = 600
      expect(value).toBe(800);
    });

    it("should handle one framework never seen, one seen recently", () => {
      const history: MatchHistory[] = [
        { pair: ["react", "angular"], round: 3, winner: "react" },
      ];
      const gameState = createGameState(
        {
          react: 1500,
          vue: 1500, // Vue never seen
        },
        history,
        8,
      );

      const value = calculatePairValue({
        pair: ["react", "vue"],
        gameState,
      });

      // aLastSeen = 8 - 3 = 5, bLastSeen = Infinity
      // participationBonus = min(5 + Infinity, 200) = 200
      // uncertaintyValue = 600
      expect(value).toBe(800);
    });

    it("should handle both frameworks seen in same round", () => {
      const history: MatchHistory[] = [
        { pair: ["react", "vue"], round: 4, winner: "react" }, // Both seen in same match
      ];
      const gameState = createGameState(
        {
          react: 1500,
          vue: 1500,
        },
        history,
        9,
      );

      const value = calculatePairValue({
        pair: ["react", "vue"],
        gameState,
      });

      // aLastSeen = 9 - 4 = 5, bLastSeen = 9 - 4 = 5
      // participationBonus = min(5 + 5, 200) = 10
      // uncertaintyValue = 600
      expect(value).toBe(610);
    });
  });

  describe("Combined Scoring", () => {
    it("should combine uncertainty and participation values correctly", () => {
      const history: MatchHistory[] = [
        { pair: ["react", "angular"], round: 1, winner: "react" },
        { pair: ["vue", "svelte"], round: 3, winner: "vue" },
      ];
      const gameState = createGameState(
        {
          react: 1520, // 20 point difference
          vue: 1500,
        },
        history,
        10,
      );

      const value = calculatePairValue({
        pair: ["react", "vue"],
        gameState,
      });

      // uncertaintyValue = max(0, 600 - 20) = 580
      // aLastSeen = 10 - 1 = 9, bLastSeen = 10 - 3 = 7
      // participationBonus = min(9 + 7, 200) = 16
      expect(value).toBe(596); // 580 + 16
    });

    it("should prioritize pairs with both high uncertainty and high participation", () => {
      const gameState = createGameState({
        react: 1500,
        vue: 1502, // Very close scores
        angular: 1500,
        svelte: 1800, // Very different scores
      });

      const closePairValue = calculatePairValue({
        pair: ["react", "vue"], // Close scores, never seen
        gameState,
      });

      const farPairValue = calculatePairValue({
        pair: ["angular", "svelte"], // Far scores, never seen
        gameState,
      });

      // Close pair should have higher value
      expect(closePairValue).toBeGreaterThan(farPairValue);

      // Specific calculations:
      // Close: uncertaintyValue = 598, participationBonus = 200, total = 798
      // Far: uncertaintyValue = 300, participationBonus = 200, total = 500
      expect(closePairValue).toBe(798);
      expect(farPairValue).toBe(500);
    });

    it("should handle extreme cases gracefully", () => {
      const history: MatchHistory[] = [
        { pair: ["react", "angular"], round: 0, winner: "react" },
        { pair: ["vue", "svelte"], round: 0, winner: "vue" },
      ];
      const gameState = createGameState(
        {
          react: -1000,
          vue: 5000, // 6000 point difference
        },
        history,
        1000,
      );

      const value = calculatePairValue({
        pair: ["react", "vue"],
        gameState,
      });

      // uncertaintyValue = max(0, 600 - 6000) = 0
      // aLastSeen = 1000, bLastSeen = 1000
      // participationBonus = min(1000 + 1000, 200) = 200
      expect(value).toBe(200);
    });
  });

  describe("Edge Cases", () => {
    it("should handle frameworks in either position of pair", () => {
      const history: MatchHistory[] = [
        { pair: ["angular", "react"], round: 2, winner: "angular" }, // React in second position
        { pair: ["vue", "svelte"], round: 4, winner: "vue" }, // Vue in first position
      ];
      const gameState = createGameState(
        {
          react: 1500,
          vue: 1500,
        },
        history,
        10,
      );

      const value = calculatePairValue({
        pair: ["react", "vue"],
        gameState,
      });

      // aLastSeen = 10 - 2 = 8, bLastSeen = 10 - 4 = 6
      // participationBonus = min(8 + 6, 200) = 14
      expect(value).toBe(614); // 600 + 14
    });

    it("should handle ties in history", () => {
      const history: MatchHistory[] = [
        { pair: ["react", "angular"], round: 3, winner: null }, // Tie
        { pair: ["vue", "svelte"], round: 5, winner: null }, // Tie
      ];
      const gameState = createGameState(
        {
          react: 1500,
          vue: 1500,
        },
        history,
        10,
      );

      const value = calculatePairValue({
        pair: ["react", "vue"],
        gameState,
      });

      // Ties should count as appearances
      // aLastSeen = 10 - 3 = 7, bLastSeen = 10 - 5 = 5
      // participationBonus = min(7 + 5, 200) = 12
      expect(value).toBe(612); // 600 + 12
    });

    it("should work with all actual framework names", () => {
      const gameState = createGameState();

      // Test a few representative pairs
      const testPairs: FeFrameworkPair[] = [
        ["alpine", "vue"],
        ["nextjs", "nuxtjs"],
        ["svelte", "sveltekit"],
        ["react", "angular"],
      ];

      testPairs.forEach((pair) => {
        const value = calculatePairValue({ pair, gameState });

        // All should have max uncertainty (600) + max participation (200) = 800
        expect(value).toBe(800);
        expect(value).toBeGreaterThan(0);
      });
    });

    it("should be deterministic for same input", () => {
      const gameState = createGameState({
        react: 1550,
        vue: 1480,
      });

      const value1 = calculatePairValue({ pair: ["react", "vue"], gameState });
      const value2 = calculatePairValue({ pair: ["react", "vue"], gameState });
      const value3 = calculatePairValue({ pair: ["vue", "react"], gameState });

      expect(value1).toBe(value2);
      expect(value1).toBe(value3); // Order shouldn't matter for scoring
    });

    it("should handle zero scores", () => {
      const gameState = createGameState({
        react: 0,
        vue: 0,
      });

      const value = calculatePairValue({
        pair: ["react", "vue"],
        gameState,
      });

      // uncertaintyValue = max(0, 600 - 0) = 600
      // participationBonus = 200
      expect(value).toBe(800);
    });
  });
});
