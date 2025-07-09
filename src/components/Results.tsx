import { getFrameworksRanking } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import { scoresSelector } from "@/redux/selectors";
import type { FC } from "react";
import { Text } from "./ui/text";

export const Results: FC = () => {
  const scores = useAppSelector(scoresSelector);
  const ranking = getFrameworksRanking(scores);
  const frameworkNameClass = (rank: number) => {
    switch (rank) {
      case 0:
        return "text-4xl font-bold tracking-wider";
      case 1:
        return "text-3xl font-semibold";
      case 2:
        return "text-2xl font-medium";
      default:
        return "text-md font-light";
    }
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
                aria-labelledby={framework.framework.id}
                src={framework.framework.logo}
                width="24"
                className="inline-block mr-4"
              />
              <span
                className={frameworkNameClass(index)}
                id={framework.framework.id}>
                {framework.framework.name}
              </span>
            </div>
            <span className="text-muted-foreground text-xs place-self-end">
              {framework.score}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
};
