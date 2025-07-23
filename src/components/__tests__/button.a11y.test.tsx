import { Button } from "@/components/ui/button";
import { renderAndCheckA11y } from "@/lib/test-utils/a11y";

describe("Button Accessibility", () => {
  test("should not have accessibility violations", async () => {
    renderAndCheckA11y(<Button>Test</Button>);
  });
});
