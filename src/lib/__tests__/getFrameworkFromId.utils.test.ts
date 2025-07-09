import { describe, it, expect } from "vitest";
import { getFrameworkFromId } from "../utils";
import React from "@/assets/react.svg";
import Vue from "@/assets/vue.svg";

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
