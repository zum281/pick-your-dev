import { MAX_ROUNDS } from "@/config";
import type { FeFrameworkKey, GameState } from "@/types";
export const getNextMatch = (
  gameState: GameState,
): [FeFrameworkKey, FeFrameworkKey] | null => {
  const { currentRound, scores } = gameState;
  if (currentRound >= MAX_ROUNDS) return null;

  const frameworks = Object.keys(scores) as FeFrameworkKey[];
  const pairs = getAllPairs(frameworks);

  const pairValues = pairs.map((pair) => {
    return {
      pair,
      value: calculatePairValue({ pair, gameState }),
    };
  });
  pairValues.sort((a, b) => b.value - a.value);

  const randomIndex = Math.floor(Math.random() * pairValues.length);
  const topCandidates = pairValues.slice(0, Math.min(3, pairValues.length));
  return topCandidates[randomIndex].pair;
};

const getAllPairs = (frameworks: FeFrameworkKey[]) => {
  const pairs: [FeFrameworkKey, FeFrameworkKey][] = [];

  for (let i = 0; i < frameworks.length; i++) {
    for (let j = i + 1; j < frameworks.length; j++) {
      pairs.push([frameworks[i], frameworks[j]]);
    }
  }

  return pairs;
};

const calculatePairValue = ({
  pair,
  gameState,
}: {
  pair: [FeFrameworkKey, FeFrameworkKey];
  gameState: GameState;
}) => {
  const { currentRound, history, scores } = gameState;
  const [a, b] = pair;
  const scoreA = scores[a];
  const scoreB = scores[b];
  // 1. Uncertainty value: pairs with similar scores are more informative
  const scoreDiff = Math.abs(scoreA - scoreB);
  const uncertaintyValue = Math.max(0, 600 - scoreDiff); // Higher value for closer scores

  // 2. Recency penalty: avoid showing the same pair too soon
  const roundsSinceLastSeen = getRoundsSinceLastSeen({
    pair,
    history,
    currentRound,
  });
  const recencyBonus = Math.min(roundsSinceLastSeen * 50, 300); // Cap the bonus

  // 3. Participation bonus: frameworks that haven't been seen recently
  const aLastSeen = getFrameworkLastSeen({
    framework: a,
    history,
    currentRound,
  });
  const bLastSeen = getFrameworkLastSeen({
    framework: b,
    history,
    currentRound,
  });
  const participationBonus = Math.min(aLastSeen + bLastSeen, 200);

  return uncertaintyValue + recencyBonus + participationBonus;
};

const getFrameworkLastSeen = ({
  framework,
  history,
  currentRound,
}: {
  framework: FeFrameworkKey;
  history: GameState["history"];
  currentRound: GameState["currentRound"];
}): number => {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].pair[0] === framework || history[i].pair[1] === framework) {
      return currentRound - history[i].round;
    }
  }
  return Infinity;
};

const getRoundsSinceLastSeen = ({
  pair,
  history,
  currentRound,
}: {
  pair: [FeFrameworkKey, FeFrameworkKey];
  history: GameState["history"];
  currentRound: GameState["currentRound"];
}): number => {
  const normalized = normalizePair(pair);

  // Find the most recent occurrence of this pair
  for (let i = history.length - 1; i >= 0; i--) {
    const historyPair = normalizePair(history[i].pair);
    if (historyPair[0] === normalized[0] && historyPair[1] === normalized[1]) {
      return currentRound - history[i].round;
    }
  }

  return Infinity;
};

const normalizePair = (pair: [FeFrameworkKey, FeFrameworkKey]) =>
  pair[0] < pair[1] ? pair : [pair[1], pair[0]];
