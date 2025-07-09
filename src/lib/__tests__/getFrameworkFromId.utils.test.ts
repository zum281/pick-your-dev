import { expect, test } from "vitest";
import Astro from "@/assets/astro.svg";
import React from "@/assets/react.svg";
import { getFrameworkFromId } from "../utils";

test("Astro framework is correct", () => {
  expect(getFrameworkFromId("astro")).toEqual({
    id: "astro",
    name: "Astro",
    logo: Astro,
  });
});

test("React framework is correct", () => {
  expect(getFrameworkFromId("react")).toEqual({
    id: "react",
    name: "React",
    logo: React,
  });
});
