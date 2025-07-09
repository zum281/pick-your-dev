import { describe, it, expect } from "vitest";
import type { FeFrameworkPair } from "@/types";
import { normalizePair } from "../next-match";

describe("normalizePair", () => {
  it("should sort pair alphabetically when first > second", () => {
    const result = normalizePair(["vue", "angular"]);
    expect(result).toEqual(["angular", "vue"]);
  });

  it("should keep pair unchanged when already sorted", () => {
    const result = normalizePair(["angular", "vue"]);
    expect(result).toEqual(["angular", "vue"]);
  });

  it("should handle pairs with very similar names", () => {
    const result = normalizePair(["nextjs", "nuxtjs"]);
    expect(result).toEqual(["nextjs", "nuxtjs"]);
  });

  it("should handle pairs with one character difference", () => {
    const result = normalizePair(["vue", "lit"]);
    expect(result).toEqual(["lit", "vue"]);
  });

  it("should correctly sort all actual framework combinations", () => {
    // Test with actual framework names
    const testCases: Array<{
      input: FeFrameworkPair;
      expected: FeFrameworkPair;
    }> = [
      { input: ["react", "angular"], expected: ["angular", "react"] },
      { input: ["svelte", "sveltekit"], expected: ["svelte", "sveltekit"] },
      { input: ["astro", "alpine"], expected: ["alpine", "astro"] },
      { input: ["remix", "react"], expected: ["react", "remix"] },
      { input: ["qwik", "gatsby"], expected: ["gatsby", "qwik"] },
    ];

    testCases.forEach(({ input, expected }) => {
      expect(normalizePair(input)).toEqual(expected);
    });
  });

  it("should be consistent - calling twice should give same result", () => {
    const pair: FeFrameworkPair = ["vue", "angular"];

    const result1 = normalizePair(pair) as FeFrameworkPair;
    const result2 = normalizePair(result1);

    expect(result1).toEqual(result2);
  });

  it("should preserve original array when already normalized", () => {
    const sortedPair: FeFrameworkPair = ["alpine", "vue"];
    const result = normalizePair(sortedPair);

    expect(result).toEqual(sortedPair);
    expect(result).toEqual(["alpine", "vue"]);
  });

  // Edge case: identical strings (shouldn't happen in real usage but good to test)
  it("should handle identical framework names", () => {
    const result = normalizePair(["react", "react"]);
    expect(result).toEqual(["react", "react"]);
  });
});
