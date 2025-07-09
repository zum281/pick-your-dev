import type { RootState } from "./redux/store";

export type FeFrameworkKey =
  | "alpine"
  | "angular"
  | "astro"
  | "fresh"
  | "gatsby"
  | "lit"
  | "nextjs"
  | "nuxtjs"
  | "qwik"
  | "react"
  | "remix"
  | "solidjs"
  | "svelte"
  | "sveltekit"
  | "vue";

export type Framework = {
  id: FeFrameworkKey;
  name: string;
  logo: string;
};

export type FeFrameworkPair = [FeFrameworkKey, FeFrameworkKey];

export type MatchHistory = {
  pair: FeFrameworkPair;
  round: number;
  winner: FeFrameworkKey;
};

export type GameState = RootState["scores"];
