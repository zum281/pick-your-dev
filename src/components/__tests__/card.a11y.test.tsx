import { render } from "@testing-library/react";
import { run as axe } from "axe-core";
import { Card } from "../ui/card";

describe("Card Accessibility", () => {
  test("should not have accessibility violations", async () => {
    const { container } = render(
      <Card>
        <Card.Header>
          <Card.Title>Title</Card.Title>
          <Card.Description>Description</Card.Description>
        </Card.Header>
        <Card.Content>Content</Card.Content>
      </Card>,
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
