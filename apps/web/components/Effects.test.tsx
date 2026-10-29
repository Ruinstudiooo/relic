import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import Effects from "./Effects.js";
import { profileSchema, type Effects as EffectsConfig } from "@relic/schema";

describe("Effects", () => {
  it("returns null when no effects are configured", () => {
    // defaults from profileSchema
    const defaultEffects: EffectsConfig = profileSchema.parse({
      slug: "test",
      name: "test",
    }).effects;

    // direct component return value
    const result = Effects({ effects: defaultEffects });
    expect(result).toBeNull();

    // DOM rendering verification: container must have no children/HTML
    const { container } = render(<Effects effects={defaultEffects} />);
    expect(container.firstChild).toBeNull();
    expect(container.innerHTML).toBe("");
  });

  it("renders cursor elements when cursor effect is active", () => {
    const cursorEffects: EffectsConfig = {
      cursor: "dot",
      particles: { enabled: false, density: 40 },
      tilt: false,
    };

    const { container } = render(<Effects effects={cursorEffects} />);
    expect(container.querySelector(".cursor-dot")).not.toBeNull();
    expect(container.querySelector(".cursor-ring")).not.toBeNull();
  });

  it("renders canvas element when particles effect is active", () => {
    const particleEffects: EffectsConfig = {
      cursor: "default",
      particles: { enabled: true, density: 40 },
      tilt: false,
    };

    const { container } = render(<Effects effects={particleEffects} />);
    expect(container.querySelector("canvas.particles")).not.toBeNull();
  });
});
