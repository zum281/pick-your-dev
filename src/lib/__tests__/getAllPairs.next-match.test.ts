import { describe, it, expect } from "vitest";
import type { FeFrameworkKey } from "@/types";
import { getAllPairs } from "../next-match";

describe("getAllPairs", () => {
  it("should generate correct pairs for 2 frameworks", () => {
    const frameworks: FeFrameworkKey[] = ["react", "vue"];
    const pairs = getAllPairs(frameworks);

    expect(pairs).toHaveLength(1);
    expect(pairs).toEqual([["react", "vue"]]);
  });

  it("should generate correct pairs for 3 frameworks", () => {
    const frameworks: FeFrameworkKey[] = ["react", "vue", "angular"];
    const pairs = getAllPairs(frameworks);

    // 3 choose 2 = 3 pairs
    expect(pairs).toHaveLength(3);
    expect(pairs).toEqual([
      ["react", "vue"],
      ["react", "angular"],
      ["vue", "angular"],
    ]);
  });

  it("should generate correct pairs for 4 frameworks", () => {
    const frameworks: FeFrameworkKey[] = ["react", "vue", "angular", "svelte"];
    const pairs = getAllPairs(frameworks);

    // 4 choose 2 = 6 pairs
    expect(pairs).toHaveLength(6);
    expect(pairs).toEqual([
      ["react", "vue"],
      ["react", "angular"],
      ["react", "svelte"],
      ["vue", "angular"],
      ["vue", "svelte"],
      ["angular", "svelte"],
    ]);
  });

  it("should generate correct number of pairs for all 15 frameworks", () => {
    const frameworks: FeFrameworkKey[] = [
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
    const pairs = getAllPairs(frameworks);

    // 15 choose 2 = 15! / (2! * 13!) = (15 * 14) / 2 = 105 pairs
    expect(pairs).toHaveLength(105);
  });

  it("should not generate duplicate pairs", () => {
    const frameworks: FeFrameworkKey[] = [
      "react",
      "vue",
      "angular",
      "svelte",
      "nextjs",
    ];
    const pairs = getAllPairs(frameworks);

    // Convert pairs to strings for easy comparison
    const pairStrings = pairs.map((pair) => `${pair[0]}-${pair[1]}`);
    const uniquePairs = new Set(pairStrings);

    expect(pairStrings.length).toBe(uniquePairs.size);
    expect(pairs).toHaveLength(10); // 5 choose 2 = 10
  });

  it("should not include self-pairs", () => {
    const frameworks: FeFrameworkKey[] = ["react", "vue", "angular"];
    const pairs = getAllPairs(frameworks);

    pairs.forEach(([a, b]) => {
      expect(a).not.toBe(b);
    });
  });

  it("should maintain order based on array position", () => {
    const frameworks: FeFrameworkKey[] = ["vue", "react", "angular"];
    const pairs = getAllPairs(frameworks);

    // First framework should appear first in pairs
    expect(pairs).toEqual([
      ["vue", "react"], // vue (index 0) with react (index 1)
      ["vue", "angular"], // vue (index 0) with angular (index 2)
      ["react", "angular"], // react (index 1) with angular (index 2)
    ]);
  });

  it("should handle single framework", () => {
    const frameworks: FeFrameworkKey[] = ["react"];
    const pairs = getAllPairs(frameworks);

    expect(pairs).toHaveLength(0);
    expect(pairs).toEqual([]);
  });

  it("should handle empty array", () => {
    const frameworks: FeFrameworkKey[] = [];
    const pairs = getAllPairs(frameworks);

    expect(pairs).toHaveLength(0);
    expect(pairs).toEqual([]);
  });

  it("should generate pairs in consistent order", () => {
    const frameworks: FeFrameworkKey[] = ["react", "vue", "angular"];

    const pairs1 = getAllPairs(frameworks);
    const pairs2 = getAllPairs(frameworks);

    expect(pairs1).toEqual(pairs2);
  });

  it("should verify mathematical correctness for combinations", () => {
    // Test the mathematical formula: n choose 2 = n! / (2! * (n-2)!) = n * (n-1) / 2
    const testCases = [
      { n: 2, expected: 1 },
      { n: 3, expected: 3 },
      { n: 4, expected: 6 },
      { n: 5, expected: 10 },
      { n: 6, expected: 15 },
      { n: 10, expected: 45 },
      { n: 15, expected: 105 },
    ];

    testCases.forEach(({ n, expected }) => {
      const frameworks = Array.from(
        { length: n },
        (_, i) => `framework${i}` as FeFrameworkKey,
      );
      const pairs = getAllPairs(frameworks);

      expect(pairs).toHaveLength(expected);
    });
  });

  it("should handle frameworks with similar names correctly", () => {
    const frameworks: FeFrameworkKey[] = [
      "svelte",
      "sveltekit",
      "nextjs",
      "nuxtjs",
    ];
    const pairs = getAllPairs(frameworks);

    expect(pairs).toHaveLength(6); // 4 choose 2

    // Verify specific pairs exist
    expect(pairs).toContainEqual(["svelte", "sveltekit"]);
    expect(pairs).toContainEqual(["nextjs", "nuxtjs"]);
    expect(pairs).toContainEqual(["svelte", "nextjs"]);
    expect(pairs).toContainEqual(["svelte", "nuxtjs"]);
    expect(pairs).toContainEqual(["sveltekit", "nextjs"]);
    expect(pairs).toContainEqual(["sveltekit", "nuxtjs"]);
  });
});
