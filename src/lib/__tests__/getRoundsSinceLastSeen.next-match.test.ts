import { describe, it, expect } from "vitest";
import type { FeFrameworkKey, MatchHistory } from "@/types";
import { getRoundsSinceLastSeen } from "../next-match";

describe("getRoundsSinceLastSeen", () => {
  it("should return Infinity for pair never seen", () => {
    const history: MatchHistory[] = [];

    const result = getRoundsSinceLastSeen({
      pair: ["react", "vue"],
      history,
      currentRound: 5,
    });

    expect(result).toBe(Infinity);
  });

  it("should return Infinity for pair never seen with non-empty history", () => {
    const history: MatchHistory[] = [
      { pair: ["angular", "svelte"], round: 1, winner: "angular" },
      { pair: ["nextjs", "remix"], round: 3, winner: "nextjs" },
    ];

    const result = getRoundsSinceLastSeen({
      pair: ["react", "vue"], // This pair never appears
      history,
      currentRound: 5,
    });

    expect(result).toBe(Infinity);
  });

  it("should return correct rounds since last seen", () => {
    const history: MatchHistory[] = [
      { pair: ["react", "vue"], round: 3, winner: "react" },
      { pair: ["angular", "svelte"], round: 5, winner: "angular" },
    ];

    const result = getRoundsSinceLastSeen({
      pair: ["react", "vue"],
      history,
      currentRound: 8,
    });

    expect(result).toBe(5); // 8 - 3
  });

  it("should normalize pairs before comparison - reversed order", () => {
    const history: MatchHistory[] = [
      { pair: ["vue", "react"], round: 2, winner: "vue" }, // Vue first in history
    ];

    const result = getRoundsSinceLastSeen({
      pair: ["react", "vue"], // React first in query
      history,
      currentRound: 6,
    });

    expect(result).toBe(4); // 6 - 2 (should find the pair despite order difference)
  });

  it("should normalize pairs consistently - same order", () => {
    const history: MatchHistory[] = [
      { pair: ["react", "vue"], round: 4, winner: "react" },
    ];

    const result = getRoundsSinceLastSeen({
      pair: ["react", "vue"], // Same order as in history
      history,
      currentRound: 9,
    });

    expect(result).toBe(5); // 9 - 4
  });

  it("should find most recent occurrence when pair appears multiple times", () => {
    const history: MatchHistory[] = [
      { pair: ["react", "vue"], round: 1, winner: "react" },
      { pair: ["angular", "svelte"], round: 3, winner: "angular" },
      { pair: ["vue", "react"], round: 6, winner: "vue" }, // Same pair, reversed order
      { pair: ["nextjs", "remix"], round: 8, winner: "nextjs" },
    ];

    const result = getRoundsSinceLastSeen({
      pair: ["react", "vue"],
      history,
      currentRound: 11,
    });

    expect(result).toBe(5); // 11 - 6 (most recent occurrence)
  });

  it("should handle ties (winner: null)", () => {
    const history: MatchHistory[] = [
      { pair: ["react", "vue"], round: 4, winner: null }, // Tie
      { pair: ["angular", "svelte"], round: 6, winner: "angular" },
    ];

    const result = getRoundsSinceLastSeen({
      pair: ["react", "vue"],
      history,
      currentRound: 9,
    });

    expect(result).toBe(5); // 9 - 4 (ties count as occurrences)
  });

  it("should work with currentRound = 0", () => {
    const history: MatchHistory[] = [
      { pair: ["react", "vue"], round: 0, winner: "react" },
    ];

    const result = getRoundsSinceLastSeen({
      pair: ["react", "vue"],
      history,
      currentRound: 0,
    });

    expect(result).toBe(0); // 0 - 0
  });

  it("should work when currentRound equals the round pair was seen", () => {
    const history: MatchHistory[] = [
      { pair: ["react", "vue"], round: 7, winner: "react" },
    ];

    const result = getRoundsSinceLastSeen({
      pair: ["react", "vue"],
      history,
      currentRound: 7,
    });

    expect(result).toBe(0); // 7 - 7
  });

  it("should search from most recent to oldest (reverse iteration)", () => {
    const history: MatchHistory[] = [
      { pair: ["react", "vue"], round: 1, winner: "react" },
      { pair: ["angular", "svelte"], round: 2, winner: "angular" },
      { pair: ["nextjs", "remix"], round: 3, winner: "nextjs" },
      { pair: ["vue", "react"], round: 4, winner: "vue" }, // Most recent occurrence
      { pair: ["qwik", "lit"], round: 5, winner: "qwik" },
    ];

    const result = getRoundsSinceLastSeen({
      pair: ["react", "vue"],
      history,
      currentRound: 8,
    });

    expect(result).toBe(4); // 8 - 4 (should find round 4, not round 1)
  });

  it("should handle complex normalization scenarios", () => {
    const testCases = [
      {
        historyPair: ["alpine", "vue"],
        queryPair: ["vue", "alpine"] as [FeFrameworkKey, FeFrameworkKey],
        shouldMatch: true,
      },
      {
        historyPair: ["nextjs", "nuxtjs"],
        queryPair: ["nuxtjs", "nextjs"] as [FeFrameworkKey, FeFrameworkKey],
        shouldMatch: true,
      },
      {
        historyPair: ["svelte", "sveltekit"],
        queryPair: ["sveltekit", "svelte"] as [FeFrameworkKey, FeFrameworkKey],
        shouldMatch: true,
      },
      {
        historyPair: ["react", "vue"],
        queryPair: ["angular", "svelte"] as [FeFrameworkKey, FeFrameworkKey],
        shouldMatch: false,
      },
    ];

    testCases.forEach(({ historyPair, queryPair, shouldMatch }) => {
      const history: MatchHistory[] = [
        {
          pair: historyPair as [FeFrameworkKey, FeFrameworkKey],
          round: 2,
          winner: historyPair[0] as FeFrameworkKey,
        },
      ];

      const result = getRoundsSinceLastSeen({
        pair: queryPair,
        history,
        currentRound: 7,
      });

      if (shouldMatch) {
        expect(result).toBe(5); // 7 - 2
      } else {
        expect(result).toBe(Infinity);
      }
    });
  });

  it("should handle multiple different pairs in history", () => {
    const history: MatchHistory[] = [
      { pair: ["react", "vue"], round: 1, winner: "react" },
      { pair: ["angular", "svelte"], round: 2, winner: "angular" },
      { pair: ["nextjs", "remix"], round: 3, winner: "nextjs" },
      { pair: ["qwik", "lit"], round: 4, winner: "qwik" },
      { pair: ["astro", "fresh"], round: 5, winner: "astro" },
    ];

    // Test that each pair can be found correctly
    const testCases = [
      {
        pair: ["react", "vue"] as [FeFrameworkKey, FeFrameworkKey],
        expectedRound: 1,
      },
      {
        pair: ["vue", "react"] as [FeFrameworkKey, FeFrameworkKey],
        expectedRound: 1,
      }, // Reversed
      {
        pair: ["angular", "svelte"] as [FeFrameworkKey, FeFrameworkKey],
        expectedRound: 2,
      },
      {
        pair: ["svelte", "angular"] as [FeFrameworkKey, FeFrameworkKey],
        expectedRound: 2,
      }, // Reversed
      {
        pair: ["qwik", "lit"] as [FeFrameworkKey, FeFrameworkKey],
        expectedRound: 4,
      },
    ];

    const currentRound = 10;

    testCases.forEach(({ pair, expectedRound }) => {
      const result = getRoundsSinceLastSeen({
        pair,
        history,
        currentRound,
      });

      expect(result).toBe(currentRound - expectedRound);
    });
  });

  it("should handle large history efficiently", () => {
    // Create large history with target pair early
    const history: MatchHistory[] = [];

    // Target pair appears in round 2
    history.push({ pair: ["react", "vue"], round: 2, winner: "react" });

    // Add many other pairs
    for (let i = 3; i < 100; i++) {
      history.push({
        pair: ["angular", "svelte"],
        round: i,
        winner: "angular",
      });
    }

    const result = getRoundsSinceLastSeen({
      pair: ["react", "vue"],
      history,
      currentRound: 150,
    });

    expect(result).toBe(148); // 150 - 2
  });

  it("should handle all possible framework combinations", () => {
    const frameworks: FeFrameworkKey[] = [
      "alpine",
      "angular",
      "astro",
      "react",
      "vue",
    ];

    frameworks.forEach((fw1, i) => {
      frameworks.forEach((fw2, j) => {
        if (i < j) {
          // Only test unique pairs
          const history: MatchHistory[] = [
            { pair: [fw1, fw2], round: 3, winner: fw1 },
          ];

          // Test both orders
          const result1 = getRoundsSinceLastSeen({
            pair: [fw1, fw2],
            history,
            currentRound: 8,
          });

          const result2 = getRoundsSinceLastSeen({
            pair: [fw2, fw1],
            history,
            currentRound: 8,
          });

          expect(result1).toBe(5); // 8 - 3
          expect(result2).toBe(5); // Should be same due to normalization
        }
      });
    });
  });

  it("should handle edge case with same round number", () => {
    const history: MatchHistory[] = [
      { pair: ["react", "vue"], round: 5, winner: "react" },
      { pair: ["angular", "svelte"], round: 5, winner: "angular" }, // Same round number
    ];

    const result = getRoundsSinceLastSeen({
      pair: ["react", "vue"],
      history,
      currentRound: 5,
    });

    expect(result).toBe(0); // 5 - 5
  });
});
