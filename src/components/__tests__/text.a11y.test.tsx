import { Text } from "@/components/ui/text";
import { renderAndCheckA11y } from "@/lib/test-utils/a11y";

describe("Text Accessibility", () => {
  test("should not have accessibility violations", async () => {
    renderAndCheckA11y(<Text>test</Text>);
  });
});
