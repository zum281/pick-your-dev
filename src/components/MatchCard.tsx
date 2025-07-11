import type { FeFrameworkKey } from "@/types";
import type { FC } from "react";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { getFrameworkFromId } from "@/lib/utils";

export const MatchCard: FC<MatchCardProps> = ({ frameworkId, onSelect }) => {
  const framework = getFrameworkFromId(frameworkId);
  return (
    <button onClick={onSelect}>
      <Card className="space-y-2 p-4 cursor-pointer">
        <img
          aria-labelledby={framework.id}
          src={framework.logo}
          height="128"
          className="aspect-square h-32"
        />
        <Text id={framework.id} className="text-center font-medium">
          {framework.name}
        </Text>
      </Card>
    </button>
  );
};

type MatchCardProps = {
  frameworkId: FeFrameworkKey;
  onSelect: () => void;
};
