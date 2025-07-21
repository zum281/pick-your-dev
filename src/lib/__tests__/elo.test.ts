import { describe, it, expect } from "vitest";
import { calculateScoreChanges, calculateTieChanges } from "../elo";

describe("calculateScoreChanges", () => {
  // Test case 1: Basic scenario where winner has a slightly higher score
  it("should calculate correct score changes for a typical win (winner higher score)", () => {
    const { winnerChange, loserChange } = calculateScoreChanges({
      winnerScore: 1600,
      loserScore: 1500,
    });
    // Expected values are calculated based on the Elo formula.
    // 1 / (1 + 10^((1500-1600)/400)) = 1 / (1 + 10^(-0.25)) = 1 / (1 + 0.5623) = 1 / 1.5623 = 0.6400
    // winnerChange = 32 * (1 - 0.6400) = 32 * 0.36 = 11.52
    // loserChange = 32 * (0 - (1 - 0.6400)) = 32 * (-0.36) = -11.52
    expect(winnerChange).toBeCloseTo(11.52, 2);
    expect(loserChange).toBeCloseTo(-11.52, 2);
  });

  // Test case 2: Basic scenario where loser has a slightly higher score (upset)
  it("should calculate correct score changes for an upset (loser higher score)", () => {
    const { winnerChange, loserChange } = calculateScoreChanges({
      winnerScore: 1500,
      loserScore: 1600,
    });
    // Expected values:
    // 1 / (1 + 10^((1600-1500)/400)) = 1 / (1 + 10^(0.25)) = 1 / (1 + 1.778) = 1 / 2.778 = 0.3600
    // winnerChange = 32 * (1 - 0.3600) = 32 * 0.64 = 20.48
    // loserChange = 32 * (0 - (1 - 0.3600)) = 32 * (-0.64) = -20.48
    expect(winnerChange).toBeCloseTo(20.48, 2);
    expect(loserChange).toBeCloseTo(-20.48, 2);
  });

  // Test case 3: Scores are equal
  it("should calculate changes correctly when scores are equal", () => {
    const { winnerChange, loserChange } = calculateScoreChanges({
      winnerScore: 1500,
      loserScore: 1500,
    });
    // Expected values:
    // 1 / (1 + 10^((1500-1500)/400)) = 1 / (1 + 10^0) = 1 / (1 + 1) = 0.5
    // winnerChange = 32 * (1 - 0.5) = 16
    // loserChange = 32 * (0 - 0.5) = -16
    expect(winnerChange).toBeCloseTo(16, 2);
    expect(loserChange).toBeCloseTo(-16, 2);
  });

  // Test case 4: Winner has a much higher score (expected win)
  it("should result in small changes when winner has a much higher score", () => {
    const { winnerChange, loserChange } = calculateScoreChanges({
      winnerScore: 2000,
      loserScore: 1000,
    });
    // Expected values:
    // 1 / (1 + 10^((1000-2000)/400)) = 1 / (1 + 10^(-2.5)) ≈ 0.99684719
    // winnerChange = 32 * (1 - 0.99684719) ≈ 0.10
    // loserChange = 32 * (0 - (1 - 0.99684719)) ≈ -0.10
    expect(Math.abs(winnerChange)).toBeCloseTo(0.1, 2);
    expect(Math.abs(loserChange)).toBeCloseTo(0.1, 2);
  });

  // Test case 5: Loser has a much higher score (big upset)
  it("should result in large changes when loser has a much higher score (upset)", () => {
    const { winnerChange, loserChange } = calculateScoreChanges({
      winnerScore: 1000,
      loserScore: 2000,
    });
    // Expected values:
    // 1 / (1 + 10^((2000-1000)/400)) = 1 / (1 + 10^2.5) ≈ 0.00315281
    // winnerChange = 32 * (1 - 0.00315281) ≈ 31.90
    // loserChange = 32 * (0 - 0.99684719) ≈ -31.90
    expect(winnerChange).toBeCloseTo(31.9, 2);
    expect(loserChange).toBeCloseTo(-31.9, 2);
  });

  // Test case 6: Custom kFactor
  it("should use the provided kFactor", () => {
    const { winnerChange, loserChange } = calculateScoreChanges({
      winnerScore: 1500,
      loserScore: 1500,
      kFactor: 16, // Half the default
    });
    // With kFactor = 16 and equal scores, changes should be half of default (16 / 2 = 8)
    expect(winnerChange).toBeCloseTo(8, 2);
    expect(loserChange).toBeCloseTo(-8, 2);
  });

  // Test case 7: Zero scores
  it("should handle zero scores correctly", () => {
    const { winnerChange, loserChange } = calculateScoreChanges({
      winnerScore: 0,
      loserScore: 0,
    });
    // Same as equal scores:
    expect(winnerChange).toBeCloseTo(16, 2);
    expect(loserChange).toBeCloseTo(-16, 2);
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
    // winnerChange = 32 * (1 - 0.6400) = 11.52
    // loserChange = 32 * (0 - (1 - 0.6400)) = -11.52
    expect(winnerChange).toBeCloseTo(11.52, 2);
    expect(loserChange).toBeCloseTo(-11.52, 2);
  });
});

describe("calculateTieChanges", () => {
  // Test case 1: Basic tie with equal scores
  it("should calculate zero changes for tie with equal scores", () => {
    const { playerAChange, playerBChange } = calculateTieChanges({
      playerAScore: 1500,
      playerBScore: 1500,
    });
    // Expected values:
    // 1 / (1 + 10^((1500-1500)/400)) = 0.5
    // playerAChange = 32 * (0.5 - 0.5) = 0
    // playerBChange = 32 * (0.5 - 0.5) = 0
    expect(playerAChange).toBeCloseTo(0, 2);
    expect(playerBChange).toBeCloseTo(0, 2);
  });

  // Test case 2: Tie where player A has higher score
  it("should decrease higher-rated player's score and increase lower-rated player's score in a tie", () => {
    const { playerAChange, playerBChange } = calculateTieChanges({
      playerAScore: 1600,
      playerBScore: 1500,
    });
    // Expected A = 1 / (1 + 10^((1500-1600)/400)) ≈ 0.64
    // Expected B = 1 - 0.64 = 0.36
    // playerAChange = 32 * (0.5 - 0.64) = 32 * (-0.14) ≈ -4.48
    // playerBChange = 32 * (0.5 - 0.36) = 32 * (0.14) ≈ 4.48
    expect(playerAChange).toBeCloseTo(-4.48, 2);
    expect(playerBChange).toBeCloseTo(4.48, 2);
  });

  // Test case 3: Tie where player B has higher score
  it("should handle tie where second player has higher score", () => {
    const { playerAChange, playerBChange } = calculateTieChanges({
      playerAScore: 1500,
      playerBScore: 1600,
    });
    // Expected A = 1 / (1 + 10^((1600-1500)/400)) ≈ 0.36
    // Expected B = 1 - 0.36 = 0.64
    // playerAChange = 32 * (0.5 - 0.36) = 32 * (0.14) ≈ 4.48
    // playerBChange = 32 * (0.5 - 0.64) = 32 * (-0.14) ≈ -4.48
    expect(playerAChange).toBeCloseTo(4.48, 2);
    expect(playerBChange).toBeCloseTo(-4.48, 2);
  });

  // Test case 4: Large score difference in tie
  it("should handle large score differences in ties", () => {
    const { playerAChange, playerBChange } = calculateTieChanges({
      playerAScore: 2000,
      playerBScore: 1000,
    });
    // Expected A ≈ 0.99684719 (A expected to almost certainly win)
    // Expected B ≈ 0.00315281
    // playerAChange = 32 * (0.5 - 0.99684719) ≈ -15.90 (A loses a lot for tying)
    // playerBChange = 32 * (0.5 - 0.00315281) ≈ 15.90 (B gains a lot for tying)
    expect(playerAChange).toBeCloseTo(-15.9, 2);
    expect(playerBChange).toBeCloseTo(15.9, 2);
  });

  // Test case 5: Custom kFactor
  it("should use the provided kFactor", () => {
    const { playerAChange, playerBChange } = calculateTieChanges({
      playerAScore: 1600,
      playerBScore: 1500,
      kFactor: 16, // Half the default
    });
    // With kFactor = 16, changes should be half of default
    // Normal change would be ±4.48, so with kFactor 16 it should be ±2.24
    expect(playerAChange).toBeCloseTo(-2.24, 2);
    expect(playerBChange).toBeCloseTo(2.24, 2);
  });

  // Test case 6: Zero scores
  it("should handle zero scores correctly", () => {
    const { playerAChange, playerBChange } = calculateTieChanges({
      playerAScore: 0,
      playerBScore: 0,
    });
    // Same as equal scores:
    expect(playerAChange).toBeCloseTo(0, 2);
    expect(playerBChange).toBeCloseTo(0, 2);
  });

  // Test case 7: Negative scores
  it("should handle negative scores correctly", () => {
    const { playerAChange, playerBChange } = calculateTieChanges({
      playerAScore: -100,
      playerBScore: -200,
    });
    // This is similar to 1600 vs 1500, just shifted down.
    // Expected A ≈ 0.64, Expected B ≈ 0.36
    // playerAChange = 32 * (0.5 - 0.64) ≈ -4.48
    // playerBChange = 32 * (0.5 - 0.36) ≈ 4.48
    expect(playerAChange).toBeCloseTo(-4.48, 2);
    expect(playerBChange).toBeCloseTo(4.48, 2);
  });

  // Test case 8: Verify tie changes sum to zero (conservation)
  it("should always have changes that sum to zero", () => {
    const testCases = [
      { playerAScore: 1500, playerBScore: 1500 },
      { playerAScore: 1600, playerBScore: 1400 },
      { playerAScore: 2000, playerBScore: 1000 },
      { playerAScore: 800, playerBScore: 1200 },
    ];

    testCases.forEach(({ playerAScore, playerBScore }) => {
      const { playerAChange, playerBChange } = calculateTieChanges({
        playerAScore,
        playerBScore,
      });
      expect(playerAChange + playerBChange).toBeCloseTo(0, 10);
    });
  });
});
