import { feFrameworks } from "@/content/fe-frameworks";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { loseMatch, winMatch } from "./redux/scoresSlice";
import { scoresSelector } from "./redux/selectors";

function App() {
  const dispatch = useAppDispatch();
  const scoreState = useAppSelector(scoresSelector);
  const playMatch = (winnerId: string, loserId: string) => {
    dispatch(winMatch(winnerId));
    dispatch(loseMatch(loserId));
  };

  return (
    <main className="space-y-2 p-4">
      <div>
        {feFrameworks[0].name}
        <button
          onClick={() => playMatch(feFrameworks[0].id, feFrameworks[1].id)}>
          Select
        </button>
      </div>
      <div>
        {feFrameworks[1].name}
        <button
          onClick={() => playMatch(feFrameworks[1].id, feFrameworks[0].id)}>
          Select
        </button>
      </div>
      <hr />
      <ul>
        {Object.keys(scoreState)
          .sort((a, b) => (scoreState[a] < scoreState[b] ? 1 : -1))
          .map((framework) => {
            const score = scoreState[framework];
            return (
              <li key={framework}>
                {framework}: {score}
              </li>
            );
          })}
      </ul>
    </main>
  );
}

export default App;
