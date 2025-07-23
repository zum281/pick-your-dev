import type { FeFrameworkKey, MatchHistory } from "@/types";

export const getFrameworkMatches = (
  framework: FeFrameworkKey,
  history: MatchHistory[],
) => {
  return history.filter(
    (match) => match.pair[0] === framework || match.pair[1] === framework,
  );
};

export const calculateWinRate = (
  framework: FeFrameworkKey,
  history: MatchHistory[],
) => {
  const matches = getFrameworkMatches(framework, history);

  const wins = matches.filter((match) => match.winner === framework).length;
  const losses = matches.filter(
    (match) => match.winner !== null && match.winner !== framework,
  ).length;
  const ties = matches.filter((match) => match.winner === null).length;

  const totalMatches = matches.length;
  const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

  return {
    wins,
    losses,
    ties,
    totalMatches,
    winRate: Math.round(winRate),
    record: `${wins}-${losses}-${ties}`,
  };
};

export const createRankings = (
  scores: Record<FeFrameworkKey, number>,
): FeFrameworkKey[] => {
  return Object.entries(scores)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .map(([framework]) => framework as FeFrameworkKey);
};

export const getFrameworkRank = (
  framework: FeFrameworkKey,
  rankings: FeFrameworkKey[],
): number => {
  return rankings.indexOf(framework) + 1;
};

export const findNotableVictories = (
  framework: FeFrameworkKey,
  history: MatchHistory[],
  scores: Record<FeFrameworkKey, number>,
) => {
  const rankings = createRankings(scores);
  const frameworkRank = getFrameworkRank(framework, rankings);

  const victories = history.filter((match) => match.winner === framework);

  const notableVictories = victories.filter((match) => {
    const opponent =
      match.pair[0] === framework ? match.pair[1] : match.pair[0];
    const opponentRank = getFrameworkRank(opponent, rankings);

    // Notable if opponent finished at least 5 positions higher AND in top 10
    return opponentRank <= 10 && frameworkRank - opponentRank >= 5;
  });

  return notableVictories.map((match) => {
    const opponent =
      match.pair[0] === framework ? match.pair[1] : match.pair[0];
    return { opponent, round: match.round };
  });
};

export const generateFrameworkInsights = (
  framework: FeFrameworkKey,
  history: MatchHistory[],
  scores: Record<FeFrameworkKey, number>,
) => {
  const winRateData = calculateWinRate(framework, history);
  const notableVictories = findNotableVictories(framework, history, scores);
  const rankings = createRankings(scores);
  const currentRank = getFrameworkRank(framework, rankings);

  return {
    framework,
    currentRank,
    winRate: winRateData,
    notableVictories,
    // Helper methods for display
    getRecordString: () => winRateData.record,
    getWinRateString: () => `${winRateData.winRate}%`,
    getNotableVictoriesString: () => {
      if (notableVictories.length === 0) return "No major upsets";
      return `Upset ${notableVictories.length} top-ranked opponent${notableVictories.length > 1 ? "s" : ""}`;
    },
  };
};

export const generateTooltipContent = (
  insights: ReturnType<typeof generateFrameworkInsights>,
) => {
  const { currentRank, winRate, notableVictories } = insights;

  // Determine the "character class" based on performance
  let title, emoji;
  if (currentRank === 1) {
    title = "The Final Boss";
    emoji = "👑";
  } else if (currentRank <= 3) {
    title = "Elite Tier";
    emoji = "🏆";
  } else if (currentRank <= 7) {
    title = "Solid Performer";
    emoji = "⚔️";
  } else if (notableVictories.length > 0) {
    title = "Giant Slayer";
    emoji = "🗡️";
  } else if (winRate.winRate >= 60) {
    title = "Overachiever";
    emoji = "💪";
  } else {
    title = "The Underdog";
    emoji = "😅";
  }

  return {
    title: `${emoji} ${insights.framework}: ${title}`,
    stats: [
      `Record: ${winRate.record} (${winRate.winRate}%)`,
      notableVictories.length > 0
        ? `Defeated ${notableVictories.length} higher-ranked opponent${notableVictories.length > 1 ? "s" : ""}`
        : "No major upsets",
      `Appeared in ${winRate.totalMatches} rounds`,
    ],
  };
};
