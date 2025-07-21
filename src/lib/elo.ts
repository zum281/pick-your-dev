export const calculateScoreChanges = ({
  winnerScore,
  loserScore,
  kFactor = 32,
}: {
  winnerScore: number;
  loserScore: number;
  kFactor?: number;
}): { winnerChange: number; loserChange: number } => {
  // Calculate expected scores (0-1 probability)
  const expectedWinner =
    1 / (1 + Math.pow(10, (loserScore - winnerScore) / 400));
  const expectedLoser = 1 - expectedWinner;

  // Calculate actual changes
  const winnerChange = kFactor * (1 - expectedWinner);
  const loserChange = kFactor * (0 - expectedLoser);

  return { winnerChange, loserChange };
};
