export const feFrameworks: Framework[] = [
  { id: "alpine", name: "Alpine.js", logo: "alpine.svg" },
  { id: "angular", name: "Angular", logo: "angular.svg" },
  { id: "astro", name: "Astro", logo: "astro.svg" },
  { id: "fresh", name: "Fresh", logo: "fresh.svg" },
  { id: "gatsby", name: "Gatsby", logo: "gatsby.svg" },
  { id: "lit", name: "Lit", logo: "lit.svg" },
  { id: "nextjs", name: "Next.js", logo: "nextjs.svg" },
  { id: "nuxtjs", name: "Nuxt.js", logo: "nuxtjs.svg" },
  { id: "qwik", name: "Qwik", logo: "qwik.svg" },
  { id: "react", name: "React", logo: "react.svg" },
  { id: "remix", name: "Remix", logo: "remix.svg" },
  { id: "solidjs", name: "SolidJS", logo: "solidjs.svg" },
  { id: "svelte", name: "Svelte", logo: "svelte.svg" },
  { id: "sveltekit", name: "SvelteKit", logo: "svelte.svg" },
  { id: "vue", name: "Vue", logo: "vue.svg" },
];

export type Framework = {
  id: string;
  name: string;
  logo: string;
};
