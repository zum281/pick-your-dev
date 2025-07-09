import { ALL_FE_FRAMEWORKS } from "@/config";
import { describe, it, expect } from "vitest";
import { getFrameworkFromId, getFrameworksRanking } from "../utils";
import type { FeFrameworkKey } from "@/types";

const createFullScoresObject = (
  partialScores: Partial<Record<FeFrameworkKey, number>>,
): Record<FeFrameworkKey, number> => {
  // Initialize the fullScores object using reduce, ensuring all keys are present
  const fullScores: Record<FeFrameworkKey, number> = ALL_FE_FRAMEWORKS.reduce(
    (acc, frameworkId) => {
      acc[frameworkId] = partialScores[frameworkId] ?? 0;
      return acc;
    },
    {} as Record<FeFrameworkKey, number>,
  ); // Type assertion for the initial accumulator

  return fullScores;
};

describe("getFrameworksRanking", () => {
  // Test case 1: Basic sorting of scores with all frameworks present
  it("should correctly rank frameworks by score in descending order, including all frameworks", () => {
    const partialScores = {
      react: 100,
      vue: 150,
      angular: 80,
      svelte: 120,
    };
    // Create a full scores object, filling missing frameworks with 0
    const scores = createFullScoresObject(partialScores);

    const result = getFrameworksRanking(scores);

    // Ensure all frameworks are present in the result
    expect(result.length).toBe(ALL_FE_FRAMEWORKS.length);

    // Verify the top-ranked items explicitly
    expect(result[0]).toEqual({
      framework: getFrameworkFromId("vue"),
      score: 150,
    });
    expect(result[1]).toEqual({
      framework: getFrameworkFromId("svelte"),
      score: 120,
    });
    expect(result[2]).toEqual({
      framework: getFrameworkFromId("react"),
      score: 100,
    });
    expect(result[3]).toEqual({
      framework: getFrameworkFromId("angular"),
      score: 80,
    });

    // Verify that all other frameworks have a score of 0 and are present
    const frameworksWithNonZeroScores = Object.keys(partialScores);
    const zeroScoreFrameworks = result.filter((item) => item.score === 0);

    expect(zeroScoreFrameworks.length).toBe(
      ALL_FE_FRAMEWORKS.length - frameworksWithNonZeroScores.length,
    );
    zeroScoreFrameworks.forEach((item) => {
      expect(item.score).toBe(0);
      // Ensure these are indeed the frameworks that were not explicitly given a score
      expect(frameworksWithNonZeroScores).not.toContain(item.framework.id);
    });
  });

  // Test case 2: Handling frameworks with same scores, with all frameworks present
  it("should handle frameworks with the same score correctly and include all frameworks", () => {
    const partialScores = {
      react: 100,
      vue: 100,
      angular: 50,
      svelte: 120,
    };
    const scores = createFullScoresObject(partialScores);

    const result = getFrameworksRanking(scores);

    // Ensure all frameworks are present in the result
    expect(result.length).toBe(ALL_FE_FRAMEWORKS.length);

    // Verify scores are sorted correctly in descending order
    expect(result[0].score).toBe(120);
    expect(result.filter((item) => item.score === 100).length).toBe(2); // Two frameworks with score 100
    expect(result.filter((item) => item.score === 50).length).toBe(1); // One framework with score 50
    expect(result.filter((item) => item.score === 0).length).toBe(
      ALL_FE_FRAMEWORKS.length - 4,
    ); // Remaining with score 0

    // Check that all expected frameworks are present, regardless of tie-breaking order
    const frameworkIds = result.map((item) => item.framework.id);
    expect(frameworkIds).toContain("svelte");
    expect(frameworkIds).toContain("react");
    expect(frameworkIds).toContain("vue");
    expect(frameworkIds).toContain("angular");
    ALL_FE_FRAMEWORKS.forEach((id) => {
      expect(frameworkIds).toContain(id); // Ensure all frameworks are accounted for
    });

    // Verify the specific objects for the tied scores, ensuring they are present
    expect(result).toContainEqual({
      framework: getFrameworkFromId("react"),
      score: 100,
    });
    expect(result).toContainEqual({
      framework: getFrameworkFromId("vue"),
      score: 100,
    });
  });

  // Test case 3: All frameworks with zero scores (renamed from Test Case 5)
  it("should correctly rank all frameworks when all have zero scores", () => {
    const scores = ALL_FE_FRAMEWORKS.reduce(
      (acc, id) => {
        acc[id] = 0;
        return acc;
      },
      {} as Record<FeFrameworkKey, number>,
    );

    const result = getFrameworksRanking(scores);

    // Expect all frameworks to be present, all with score 0
    expect(result.length).toBe(ALL_FE_FRAMEWORKS.length);
    result.forEach((item) => {
      expect(item.score).toBe(0);
      expect(ALL_FE_FRAMEWORKS).toContain(item.framework.id);
    });
    // Since all scores are 0, the order among them is not guaranteed by the sort function,
    // but all should be present.
  });
});
