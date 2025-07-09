import type { ALL_FE_FRAMEWORKS } from "@/config";
import type { RootState } from "@/redux/store";

type FeFrameworkKeyTuple = typeof ALL_FE_FRAMEWORKS;
export type FeFrameworkKey = FeFrameworkKeyTuple[number];

export type Framework = {
  id: FeFrameworkKey;
  name: string;
  logo: string;
};

export type FeFrameworkPair = [FeFrameworkKey, FeFrameworkKey];

export type MatchHistory = {
  pair: FeFrameworkPair;
  round: number;
  winner: FeFrameworkKey | null;
};

export type GameState = RootState["scores"];
