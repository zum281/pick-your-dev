import Alpine from "@/assets/alpine.svg";
import Angular from "@/assets/angular.svg";
import Astro from "@/assets/astro.svg";
import Fresh from "@/assets/fresh.svg";
import Gatsby from "@/assets/gatsby.svg";
import Lit from "@/assets/lit.svg";
import NextJs from "@/assets/nextjs.svg";
import NuxtJs from "@/assets/nuxtjs.svg";
import Qwik from "@/assets/qwik.svg";
import React from "@/assets/react.svg";
import Remix from "@/assets/remix.svg";
import SolidJs from "@/assets/solidjs.svg";
import Svelte from "@/assets/svelte.svg";
import Vue from "@/assets/vue.svg";

export const feFrameworks: Framework[] = [
  { id: "alpine", name: "Alpine.js", logo: Alpine },
  { id: "angular", name: "Angular", logo: Angular },
  { id: "astro", name: "Astro", logo: Astro },
  { id: "fresh", name: "Fresh", logo: Fresh },
  { id: "gatsby", name: "Gatsby", logo: Gatsby },
  { id: "lit", name: "Lit", logo: Lit },
  { id: "nextjs", name: "Next.js", logo: NextJs },
  { id: "nuxtjs", name: "Nuxt.js", logo: NuxtJs },
  { id: "qwik", name: "Qwik", logo: Qwik },
  { id: "react", name: "React", logo: React },
  { id: "remix", name: "Remix", logo: Remix },
  { id: "solidjs", name: "SolidJS", logo: SolidJs },
  { id: "svelte", name: "Svelte", logo: Svelte },
  { id: "sveltekit", name: "SvelteKit", logo: Svelte },
  { id: "vue", name: "Vue", logo: Vue },
];

export type Framework = {
  id: string;
  name: string;
  logo: string;
};
