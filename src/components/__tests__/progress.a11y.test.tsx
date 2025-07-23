import { Progress } from "@/components/ui/progress";
import { renderAndCheckA11y } from "@/lib/test-utils/a11y";

describe("Progress Accessibility", () => {
  test("should not have accessibility violations", async () => {
    renderAndCheckA11y(<Progress title="title" />);
  });
});
