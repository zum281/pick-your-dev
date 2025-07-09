import { feFrameworks } from "@/content/fe-frameworks";
import type { FeFrameworkKey, Framework, GameState } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFrameworkFromId = (id: FeFrameworkKey): Framework =>
  feFrameworks.find((framework) => framework.id === id)!;

export const getFrameworksRanking = (scores: GameState["scores"]) => {
  return Object.entries(scores)
    .map(([framework, score]) => ({
      framework: getFrameworkFromId(framework as FeFrameworkKey),
      score,
    }))
    .sort((a, b) => b.score - a.score);
};
