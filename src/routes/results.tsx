import { getFrameworksRanking } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { historySelector, scoresSelector } from "@/redux/selectors";
import type { FC } from "react";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { resetGame } from "@/redux/scoresSlice";
import { useLocation } from "wouter";
import type { FeFrameworkKey, GameState } from "@/types";
import {
  generateFrameworkInsights,
  generateTooltipContent,
} from "@/lib/ranking-insights.utils";

export const Results: FC = () => {
  const [, navigate] = useLocation();
  const dispatch = useAppDispatch();
  const scores = useAppSelector(scoresSelector);
  const history = useAppSelector(historySelector);
  const ranking = getFrameworksRanking(scores);
  const frameworkNameClass = (rank: number) => {
    switch (rank) {
      case 0:
        return "text-4xl font-black";
      case 1:
        return "text-3xl font-semibold";
      case 2:
        return "text-2xl font-medium";
      default:
        return "text-md font-light";
    }
  };

  const restartGame = () => {
    dispatch(resetGame());
    navigate("/");
  };

  const getInsightsTooltip = (
    framework: FeFrameworkKey,
    history: GameState["history"],
  ) => {
    const insights = generateFrameworkInsights(framework, history, scores);
    const tooltipContent = generateTooltipContent(insights);

    // Format as a single string for the title attribute
    return `${tooltipContent.title}\n${tooltipContent.stats.join("\n")}`;
  };

  return (
    <>
      <Text as="h1" className="font-medium text-center">
        Your results
      </Text>
      <ul className="space-y-2 text-foreground">
        {ranking.map((framework, index) => (
          <li
            key={framework.framework.id}
            className="grid grid-cols-2 gap-8 items-baseline border-b border-b-muted pb-1">
            <div>
              <span className="mr-4 text-muted-foreground text-xs">
                {index + 1}.
              </span>
              <img
                role="presentation"
                alt=""
                src={framework.framework.logo}
                width="24"
                className="inline-block mr-4 max-sm:hidden"
              />
              <span
                className={frameworkNameClass(index)}
                id={framework.framework.id}>
                {framework.framework.name}
              </span>
            </div>
            <div className="place-self-end flex items-center gap-1">
              <span className="text-muted-foreground text-xs ">
                {Math.round(framework.score)}
              </span>

              <button
                className="text-muted-foreground hover:text-foreground text-xs"
                title={getInsightsTooltip(framework.framework.id, history)}>
                ⓘ
              </button>
            </div>
          </li>
        ))}
      </ul>
      <Button onClick={restartGame}>Play again!</Button>
    </>
  );
};
