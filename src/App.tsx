import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
  loseMatch,
  updateCurrentRound,
  updateHistory,
  winMatch,
} from "./redux/scoresSlice";
import {
  currentRoundSelector,
  historySelector,
  scoresSelector,
} from "./redux/selectors";
import type { FeFrameworkKey, MatchHistory } from "./types";
import { getNextMatch } from "./lib/elo";
import { getFrameworkFromId } from "./lib/utils";

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

    dispatch(winMatch(winnerId));
    dispatch(loseMatch(loserId));
    dispatch(updateCurrentRound());
    dispatch(updateHistory(matchup));
  };

  const matchingPair = getNextMatch({ scores, history, currentRound });
  if (!matchingPair)
    return (
      <ul>
        {Object.keys(scores)
          .sort((a, b) =>
            scores[a as FeFrameworkKey] < scores[b as FeFrameworkKey] ? 1 : -1,
          )
          .map((framework) => {
            const score = scores[framework as FeFrameworkKey];
            return (
              <li key={framework}>
                {getFrameworkFromId(framework as FeFrameworkKey).name}: {score}
              </li>
            );
          })}
      </ul>
    );

  return (
    <main className="space-y-2 p-4">
      <ul>
        {matchingPair.map((framework, index) => (
          <li key={framework}>
            <h2>{getFrameworkFromId(framework).name}</h2>
            <button
              onClick={() =>
                playMatch(
                  matchingPair[index],
                  matchingPair[index === 0 ? 1 : 0],
                )
              }>
              Select
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
