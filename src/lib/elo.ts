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

export const calculateTieChanges = ({
  playerAScore,
  playerBScore,
  kFactor = 32,
}: {
  playerAScore: number;
  playerBScore: number;
  kFactor?: number;
}): { playerAChange: number; playerBChange: number } => {
  const expectedA = 1 / (1 + Math.pow(10, (playerBScore - playerAScore) / 400));
  const expectedB = 1 - expectedA;

  // Each player gets 0.5 points (halfway between win=1 and loss=0)
  const playerAChange = kFactor * (0.5 - expectedA);
  const playerBChange = kFactor * (0.5 - expectedB);

  return { playerAChange, playerBChange };
};
