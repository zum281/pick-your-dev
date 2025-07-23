import { Layout } from "@/components/Layout";
import { renderAndCheckA11y } from "@/lib/test-utils/a11y";

describe("Layout Accessibility", () => {
  test("should not have accessibility violations", async () => {
    renderAndCheckA11y(<Layout>test</Layout>);
  });
});
