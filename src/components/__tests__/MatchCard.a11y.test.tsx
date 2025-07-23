import { render } from "@testing-library/react";
import { run as axe } from "axe-core";
import { MatchCard } from "../MatchCard";

describe("MatchCard Accessibility", () => {
  test("should not have accessibility violations", async () => {
    const { container } = render(
      <MatchCard frameworkId="react" onSelect={() => {}} />,
    );

    const results = await axe(container);

    if (results.violations.length > 0) {
      const violationMessages = results.violations
        .map((violation) => {
          const nodeMessages = violation.nodes
            .map((node) => `  - ${node.html}\n    ${node.failureSummary}`)
            .join("\n");

          return `${violation.id}: ${violation.description}\n${nodeMessages}`;
        })
        .join("\n\n");

      throw new Error(
        `Accessibility violations found:\n\n${violationMessages}`,
      );
    }

    expect(results.violations).toHaveLength(0);
  });
});
