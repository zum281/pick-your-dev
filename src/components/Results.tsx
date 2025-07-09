import { getFrameworksRanking } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import { scoresSelector } from "@/redux/selectors";
import type { FC } from "react";

export const Results: FC = () => {
  const scores = useAppSelector(scoresSelector);
  const ranking = getFrameworksRanking(scores);
  return (
    <ul>
      {ranking.map((framework) => (
        <li key={framework.framework.id}>
          {framework.framework.name}: {framework.score}
        </li>
      ))}
    </ul>
  );
};
