import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  loseMatch,
  updateCurrentRound,
  updateHistory,
  winMatch,
} from "@/redux/scoresSlice";
import {
  currentRoundSelector,
  historySelector,
  scoresSelector,
} from "@/redux/selectors";
import type { FeFrameworkKey, FeFrameworkPair, MatchHistory } from "@/types";
import { getNextMatch } from "@/lib/next-match";
import { calculateScoreChanges, calculateTieChanges } from "@/lib/elo";
import { Progress } from "@/components/ui/progress";
import { MAX_ROUNDS } from "@/config";
import { MatchCard } from "@/components/MatchCard";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import type { FC } from "react";
import { useLocation } from "wouter";
import { createPortal } from "react-dom";

export const FrontEndQuiz: FC = () => {
  const [, navigate] = useLocation();
  const dispatch = useAppDispatch();
  const scores = useAppSelector(scoresSelector);
  const history = useAppSelector(historySelector);
  const currentRound = useAppSelector(currentRoundSelector);
  const matchingPair = getNextMatch({ scores, history, currentRound });

  const tieMatch = (pair: FeFrameworkPair) => {
    const playerA = matchingPair![0];
    const playerB = matchingPair![1];
    const { playerAChange, playerBChange } = calculateTieChanges({
      playerAScore: scores[playerA],
      playerBScore: scores[playerB],
    });

    if (playerAChange >= 0)
      winMatch({ framework: playerA, scoreChange: playerAChange });
    else loseMatch({ framework: playerA, scoreChange: playerAChange });
    if (playerBChange >= 0)
      winMatch({ framework: playerB, scoreChange: playerBChange });
    else loseMatch({ framework: playerB, scoreChange: playerBChange });

    dispatch(updateCurrentRound());
    const matchup: MatchHistory = {
      pair,
      round: currentRound,
      winner: null,
    };
    dispatch(updateHistory(matchup));
  };

  const playMatch = (winnerId: FeFrameworkKey, loserId: FeFrameworkKey) => {
    const scoreChanges = calculateScoreChanges({
      winnerScore: scores[winnerId],
      loserScore: scores[loserId],
    });

    dispatch(
      winMatch({ framework: winnerId, scoreChange: scoreChanges.winnerChange }),
    );
    dispatch(
      loseMatch({ framework: loserId, scoreChange: scoreChanges.loserChange }),
    );
    dispatch(updateCurrentRound());
    const matchup: MatchHistory = {
      pair: [winnerId, loserId],
      round: currentRound,
      winner: winnerId,
    };
    dispatch(updateHistory(matchup));
  };

  const progressValue = (currentRound * 100) / MAX_ROUNDS;

  if (!matchingPair) {
    navigate("/results");
    return;
  }

  return (
    <>
      <Text as="h1" className="font-medium text-center">
        Pick your favorite!
      </Text>
      <div className="flex flex-wrap gap-4 items-center justify-center">
        {matchingPair.map((framework, index) => (
          <MatchCard
            key={framework}
            frameworkId={framework}
            onSelect={() =>
              playMatch(matchingPair[index], matchingPair[index === 0 ? 1 : 0])
            }
          />
        ))}
      </div>
      <Button
        variant="link"
        className="text-muted-foreground focus:ring text-sm place-self-center"
        onClick={() => tieMatch(matchingPair)}>
        I don't care about any of them
      </Button>
      {createPortal(
        <Progress
          value={progressValue}
          className="absolute top-0 border-none"
        />,
        document.body,
      )}
    </>
  );
};
