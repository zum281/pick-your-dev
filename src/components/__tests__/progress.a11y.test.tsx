import { Progress } from "../ui/progress";
import { renderAndCheckA11y } from "../../lib/test-utils/a11y";
import React from "react";

describe("Progress Accessibility", () => {
  test("should not have accessibility violations", async () => {
    renderAndCheckA11y(<Progress title="title" />);
  });
});
