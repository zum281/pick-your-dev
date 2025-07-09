import { describe, it, expect } from "vitest";
import { calculateScoreChanges } from "../elo";

describe("calculateScoreChanges", () => {
  // Test case 1: Basic scenario where winner has a slightly higher score
  it("should calculate correct score changes for a typical win (winner higher score)", () => {
    const { winnerChange, loserChange } = calculateScoreChanges({
      winnerScore: 1600,
      loserScore: 1500,
    });
    // Expected values are calculated based on the Elo formula.
    // 1 / (1 + 10^((1500-1600)/400)) = 1 / (1 + 10^(-100/400)) = 1 / (1 + 10^(-0.25)) = 1 / (1 + 0.5623) = 1 / 1.5623 = 0.6400
    // winnerChange = round(32 * (1 - 0.6400)) = round(32 * 0.36) = round(11.52) = 12
    // loserChange = round(32 * (0 - (1 - 0.6400))) = round(32 * (-0.36)) = round(-11.52) = -12
    expect(winnerChange).toBe(12);
    expect(loserChange).toBe(-12);
  });

  // Test case 2: Basic scenario where loser has a slightly higher score (upset)
  it("should calculate correct score changes for an upset (loser higher score)", () => {
    const { winnerChange, loserChange } = calculateScoreChanges({
      winnerScore: 1500,
      loserScore: 1600,
    });
    // Expected values:
    // 1 / (1 + 10^((1600-1500)/400)) = 1 / (1 + 10^(100/400)) = 1 / (1 + 10^(0.25)) = 1 / (1 + 1.778) = 1 / 2.778 = 0.3600
    // winnerChange = round(32 * (1 - 0.3600)) = round(32 * 0.64) = round(20.48) = 20
    // loserChange = round(32 * (0 - (1 - 0.3600))) = round(32 * (-0.64)) = round(-20.48) = -20
    expect(winnerChange).toBe(20);
    expect(loserChange).toBe(-20);
  });

  // Test case 3: Scores are equal
  it("should calculate changes correctly when scores are equal", () => {
    const { winnerChange, loserChange } = calculateScoreChanges({
      winnerScore: 1500,
      loserScore: 1500,
    });
    // Expected values:
    // 1 / (1 + 10^((1500-1500)/400)) = 1 / (1 + 10^0) = 1 / (1 + 1) = 0.5
    // winnerChange = Math.round(32 * (1 - 0.5)) = Math.round(16) = 16
    // loserChange = Math.round(32 * (0 - 0.5)) = Math.round(-16) = -16
    expect(winnerChange).toBe(16);
    expect(loserChange).toBe(-16);
  });

  // Test case 4: Winner has a much higher score (expected win)
  it("should result in small changes when winner has a much higher score", () => {
    const { winnerChange, loserChange } = calculateScoreChanges({
      winnerScore: 2000,
      loserScore: 1000,
    });
    // Expected values:
    // 1 / (1 + 10^((1000-2000)/400)) = 1 / (1 + 10^(-2.5)) = 1 / (1 + 0.00316227766) = 1 / 1.00316227766 = 0.99684719
    // winnerChange = Math.round(32 * (1 - 0.99684719)) = Math.round(32 * 0.00315281) = Math.round(0.10088992) = 0
    // loserChange = Math.round(32 * (0 - (1 - 0.99684719))) = Math.round(32 * (-0.00315281)) = Math.round(-0.10088992) = 0
    expect(winnerChange).toBeCloseTo(0);
    expect(loserChange).toBeCloseTo(0);
  });

  // Test case 5: Loser has a much higher score (big upset)
  it("should result in large changes when loser has a much higher score (upset)", () => {
    const { winnerChange, loserChange } = calculateScoreChanges({
      winnerScore: 1000,
      loserScore: 2000,
    });
    // Expected values:
    // 1 / (1 + 10^((2000-1000)/400)) = 1 / (1 + 10^2.5) = 1 / (1 + 316.227766) = 1 / 317.227766 = 0.00315281
    // winnerChange = Math.round(32 * (1 - 0.00315281)) = Math.round(32 * 0.99684719) = Math.round(31.89910992) = 32
    // loserChange = Math.round(32 * (0 - 0.99684719)) = Math.round(-31.89910992) = -32
    expect(winnerChange).toBe(32);
    expect(loserChange).toBe(-32);
  });

  // Test case 6: Custom kFactor
  it("should use the provided kFactor", () => {
    const { winnerChange, loserChange } = calculateScoreChanges({
      winnerScore: 1500,
      loserScore: 1500,
      kFactor: 16, // Half the default
    });
    // With kFactor = 16 and equal scores, changes should be half of default (16 / 2 = 8)
    expect(winnerChange).toBe(8);
    expect(loserChange).toBe(-8);
  });

  // Test case 7: Zero scores
  it("should handle zero scores correctly", () => {
    const { winnerChange, loserChange } = calculateScoreChanges({
      winnerScore: 0,
      loserScore: 0,
    });
    // Same as equal scores:
    expect(winnerChange).toBe(16);
    expect(loserChange).toBe(-16);
  });

  // Test case 8: Negative scores (if applicable to the domain)
  it("should handle negative scores correctly", () => {
    const { winnerChange, loserChange } = calculateScoreChanges({
      winnerScore: -100,
      loserScore: -200,
    });
    // This is similar to 1600 vs 1500, just shifted down.
    // (loserScore - winnerScore) / 400 = (-200 - (-100)) / 400 = -100 / 400 = -0.25
    // ExpectedWinner = 1 / (1 + 10^(-0.25)) = 0.6400
    // winnerChange = Math.round(32 * (1 - 0.6400)) = 12
    // loserChange = Math.round(32 * (0 - (1 - 0.6400))) = -12
    expect(winnerChange).toBe(12);
    expect(loserChange).toBe(-12);
  });
});
