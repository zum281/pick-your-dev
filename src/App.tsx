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
import type { FeFrameworkKey, MatchHistory } from "@/types";
import { getNextMatch } from "@/lib/next-match";
import { calculateScoreChanges } from "./lib/elo";
import { Results } from "@/components/Results";
import { Progress } from "@/components/ui/progress";
import { MAX_ROUNDS } from "./config";
import { MatchCard } from "./components/MatchCard";
import { Text } from "@/components/ui/text";

function App() {
  const dispatch = useAppDispatch();
  const scores = useAppSelector(scoresSelector);
  const history = useAppSelector(historySelector);
  const currentRound = useAppSelector(currentRoundSelector);

  const playMatch = (winnerId: FeFrameworkKey, loserId: FeFrameworkKey) => {
    const matchup: MatchHistory = {
      pair: [winnerId, loserId],
      round: currentRound,
      winner: winnerId,
    };

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
    dispatch(updateHistory(matchup));
  };

  const progressValue = (currentRound * 100) / MAX_ROUNDS;

  const matchingPair = getNextMatch({ scores, history, currentRound });
  if (!matchingPair) return <Results />;

  return (
    <main className="h-screen">
      <section className="gap-16 p-4 mx-auto max-w-xl grid place-content-center h-full">
        <Text as="h1" className="font-medium">
          Pick your favorite!
        </Text>
        <div className="flex flex-wrap gap-4 items-center justify-center">
          {matchingPair.map((framework, index) => (
            <MatchCard
              key={framework}
              frameworkId={framework}
              onSelect={() =>
                playMatch(
                  matchingPair[index],
                  matchingPair[index === 0 ? 1 : 0],
                )
              }
            />
          ))}
        </div>
      </section>
      <Progress value={progressValue} className="absolute top-0 border-none" />
    </main>
  );
}

export default App;
