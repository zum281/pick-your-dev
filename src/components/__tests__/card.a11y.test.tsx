import React from "react";
import { Card } from "../ui/card";
import { renderAndCheckA11y } from "../../lib/test-utils/a11y";

describe("Card Accessibility", () => {
  test("should not have accessibility violations", async () => {
    renderAndCheckA11y(
      <Card>
        <Card.Header>
          <Card.Title>Title</Card.Title>
          <Card.Description>Description</Card.Description>
        </Card.Header>
        <Card.Content>Content</Card.Content>
      </Card>,
    );
  });
});
