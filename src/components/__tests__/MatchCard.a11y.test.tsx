import { MatchCard } from "@/components/MatchCard";
import { renderAndCheckA11y } from "@/lib/test-utils/a11y";

describe("MatchCard Accessibility", () => {
  test("should not have accessibility violations", async () => {
    renderAndCheckA11y(<MatchCard frameworkId="react" onSelect={() => {}} />);
  });
});
