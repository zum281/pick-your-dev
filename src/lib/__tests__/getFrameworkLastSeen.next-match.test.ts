import { describe, it, expect } from "vitest";
import type { FeFrameworkKey, MatchHistory } from "@/types";
import { getFrameworkLastSeen } from "../next-match";

describe("getFrameworkLastSeen", () => {
  it("should return Infinity for framework never seen", () => {
    const history: MatchHistory[] = [];

    const result = getFrameworkLastSeen({
      framework: "react",
      history,
      currentRound: 5,
    });

    expect(result).toBe(Infinity);
  });

  it("should return Infinity for framework never seen with non-empty history", () => {
    const history: MatchHistory[] = [
      { pair: ["vue", "angular"], round: 1, winner: "vue" },
      { pair: ["svelte", "nextjs"], round: 3, winner: "svelte" },
    ];

    const result = getFrameworkLastSeen({
      framework: "react", // React never appears in history
      history,
      currentRound: 5,
    });

    expect(result).toBe(Infinity);
  });

  it("should return correct rounds since last seen - first position", () => {
    const history: MatchHistory[] = [
      { pair: ["react", "vue"], round: 2, winner: "react" },
      { pair: ["angular", "svelte"], round: 4, winner: "angular" },
    ];

    const result = getFrameworkLastSeen({
      framework: "react",
      history,
      currentRound: 8,
    });

    expect(result).toBe(6); // 8 - 2
  });

  it("should return correct rounds since last seen - second position", () => {
    const history: MatchHistory[] = [
      { pair: ["vue", "react"], round: 3, winner: "vue" },
      { pair: ["angular", "svelte"], round: 5, winner: "angular" },
    ];

    const result = getFrameworkLastSeen({
      framework: "react",
      history,
      currentRound: 9,
    });

    expect(result).toBe(6); // 9 - 3
  });

  it("should find most recent occurrence when framework appears multiple times", () => {
    const history: MatchHistory[] = [
      { pair: ["react", "vue"], round: 1, winner: "react" },
      { pair: ["angular", "svelte"], round: 3, winner: "angular" },
      { pair: ["react", "nextjs"], round: 5, winner: "nextjs" },
      { pair: ["qwik", "react"], round: 8, winner: "react" },
    ];

    const result = getFrameworkLastSeen({
      framework: "react",
      history,
      currentRound: 12,
    });

    expect(result).toBe(4); // 12 - 8 (most recent appearance)
  });

  it("should work when framework appears in both positions across different rounds", () => {
    const history: MatchHistory[] = [
      { pair: ["react", "vue"], round: 2, winner: "react" }, // React in first position
      { pair: ["angular", "react"], round: 5, winner: "angular" }, // React in second position
      { pair: ["react", "svelte"], round: 7, winner: "react" }, // React in first position again
    ];

    const result = getFrameworkLastSeen({
      framework: "react",
      history,
      currentRound: 10,
    });

    expect(result).toBe(3); // 10 - 7 (most recent)
  });

  it("should handle ties (winner: null)", () => {
    const history: MatchHistory[] = [
      { pair: ["react", "vue"], round: 4, winner: null }, // Tie
      { pair: ["angular", "svelte"], round: 6, winner: "angular" },
    ];

    const result = getFrameworkLastSeen({
      framework: "react",
      history,
      currentRound: 9,
    });

    expect(result).toBe(5); // 9 - 4 (ties count as appearances)
  });

  it("should handle when framework loses", () => {
    const history: MatchHistory[] = [
      { pair: ["react", "vue"], round: 3, winner: "vue" }, // React loses
    ];

    const result = getFrameworkLastSeen({
      framework: "react",
      history,
      currentRound: 7,
    });

    expect(result).toBe(4); // 7 - 3 (losing still counts as appearance)
  });

  it("should work with currentRound = 0", () => {
    const history: MatchHistory[] = [
      { pair: ["react", "vue"], round: 0, winner: "react" },
    ];

    const result = getFrameworkLastSeen({
      framework: "react",
      history,
      currentRound: 0,
    });

    expect(result).toBe(0); // 0 - 0
  });

  it("should work when currentRound equals the round framework was seen", () => {
    const history: MatchHistory[] = [
      { pair: ["react", "vue"], round: 5, winner: "react" },
    ];

    const result = getFrameworkLastSeen({
      framework: "react",
      history,
      currentRound: 5,
    });

    expect(result).toBe(0); // 5 - 5
  });

  it("should search from most recent to oldest (reverse order)", () => {
    const history: MatchHistory[] = [
      { pair: ["react", "vue"], round: 1, winner: "react" },
      { pair: ["angular", "svelte"], round: 2, winner: "angular" },
      { pair: ["react", "nextjs"], round: 3, winner: "react" },
      { pair: ["qwik", "lit"], round: 4, winner: "qwik" },
      { pair: ["react", "remix"], round: 5, winner: "remix" },
    ];

    const result = getFrameworkLastSeen({
      framework: "react",
      history,
      currentRound: 8,
    });

    // Should find round 5 (most recent), not round 1 or 3
    expect(result).toBe(3); // 8 - 5
  });

  it("should handle large history efficiently", () => {
    // Create a large history where react appears early
    const history: MatchHistory[] = [];

    // React appears in round 2
    history.push({ pair: ["react", "vue"], round: 2, winner: "react" });

    // Add many rounds without react
    for (let i = 3; i < 100; i++) {
      history.push({
        pair: ["angular", "svelte"],
        round: i,
        winner: "angular",
      });
    }

    const result = getFrameworkLastSeen({
      framework: "react",
      history,
      currentRound: 120,
    });

    expect(result).toBe(118); // 120 - 2
  });

  it("should handle all framework names correctly", () => {
    const allFrameworks: FeFrameworkKey[] = [
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

    allFrameworks.forEach((framework, index) => {
      const history: MatchHistory[] = [
        { pair: [framework, "react"], round: index, winner: framework },
      ];

      const result = getFrameworkLastSeen({
        framework,
        history,
        currentRound: 20,
      });

      expect(result).toBe(20 - index);
    });
  });

  it("should handle empty framework name edge cases", () => {
    const history: MatchHistory[] = [
      { pair: ["react", "vue"], round: 1, winner: "react" },
    ];

    // This test mainly ensures the function doesn't crash with invalid input
    // In real usage, TypeScript should prevent this
    const result = getFrameworkLastSeen({
      framework: "" as FeFrameworkKey,
      history,
      currentRound: 5,
    });

    expect(result).toBe(Infinity);
  });
});
