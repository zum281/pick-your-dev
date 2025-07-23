import { render } from "@testing-library/react";
import { virtual } from "@guidepup/virtual-screen-reader";
import { Progress } from "../ui/progress";
import React from "react";

describe("Progress Screen Reader Tests", () => {
  afterEach(async () => {
    await virtual.stop();
  });

  test("should announce current value when navigated to", async () => {
    const { container, rerender } = render(
      <Progress value={25} title="Game completion progress" />,
    );

    await virtual.start({ container });
    await virtual.next();

    let announcement = await virtual.lastSpokenPhrase();
    expect(announcement).toContain("25");

    // Update progress
    rerender(<Progress value={75} title="Game completion progress" />);

    // Navigate to it again to hear updated value
    await virtual.previous(); // Go back
    await virtual.next(); // Navigate to progress again

    announcement = await virtual.lastSpokenPhrase();
    expect(announcement).toContain("75");
  });
});
