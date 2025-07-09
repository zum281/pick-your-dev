import { describe, it, expect } from "vitest";
import { getFrameworkFromId } from "../utils";
import React from "@/assets/react.svg";
import Vue from "@/assets/vue.svg";
import type { FeFrameworkKey } from "@/types";

describe("getFrameworkFromId", () => {
  it("should return the correct framework object for a valid id 'react'", () => {
    const reactFramework = getFrameworkFromId("react");
    expect(reactFramework).toEqual({
      id: "react",
      name: "React",
      logo: React,
    });
  });

  it("should return the correct framework object for valid id 'vue'", () => {
    const vueFramework = getFrameworkFromId("vue");
    expect(vueFramework).toEqual({
      id: "vue",
      name: "Vue",
      logo: Vue,
    });
  });
});

it("should return correct framework for all valid IDs", () => {
  expect(getFrameworkFromId("alpine")).toBeDefined();
  expect(getFrameworkFromId("angular")).toBeDefined();
  expect(getFrameworkFromId("astro")).toBeDefined();
  expect(getFrameworkFromId("fresh")).toBeDefined();
  expect(getFrameworkFromId("gatsby")).toBeDefined();
  expect(getFrameworkFromId("lit")).toBeDefined();
  expect(getFrameworkFromId("nextjs")).toBeDefined();
  expect(getFrameworkFromId("nuxtjs")).toBeDefined();
  expect(getFrameworkFromId("qwik")).toBeDefined();
  expect(getFrameworkFromId("react")).toBeDefined();
  expect(getFrameworkFromId("remix")).toBeDefined();
  expect(getFrameworkFromId("solidjs")).toBeDefined();
  expect(getFrameworkFromId("svelte")).toBeDefined();
  expect(getFrameworkFromId("sveltekit")).toBeDefined();
  expect(getFrameworkFromId("vue")).toBeDefined();
});

it("should return undefined for invalid framework ID", () => {
  expect(getFrameworkFromId("invalid" as FeFrameworkKey)).toBeUndefined();
});
