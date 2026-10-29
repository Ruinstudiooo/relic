import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import ProfileView from "./ProfileView.js";
import { profileSchema, type Profile, LINK_ICONS } from "@relic/schema";

describe("ProfileView", () => {
  it("matches snapshot for minimal profile", () => {
    const minimal: Profile = profileSchema.parse({
      slug: "minimal",
      name: "Minimal",
    });

    const { container } = render(<ProfileView profile={minimal} />);
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot for full profile", () => {
    const full: Profile = profileSchema.parse({
      slug: "full",
      name: "Romeo",
      bio: "Full profile with custom theme and multiple socials",
      avatar: "https://example.com/avatar.png",
      status: "Active building",
      links: [
        { label: "github", url: "https://github.com/RomeoXLover", icon: "github", highlight: true },
        { label: "x", url: "https://x.com/romeo", icon: "x" },
        { label: "discord", url: "https://discord.gg/relic", icon: "discord" },
        { label: "spotify", url: "https://spotify.com/artist/romeo", icon: "spotify" },
        { label: "website", url: "https://example.com", icon: "website" },
      ],
      theme: {
        accent: "#ff007f",
        background: { type: "image", value: "https://example.com/bg.png", blur: 10 },
        text: "light",
        font: "space-grotesk",
        radius: 16,
      },
      effects: {
        cursor: "ring",
        particles: { enabled: true, density: 50 },
        tilt: true,
      },
    });

    const { container } = render(<ProfileView profile={full} />);
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot for stress profile", () => {
    const links = Array.from({ length: 24 }, (_, i) => ({
      label: `Link-${i}-${"x".repeat(35)}`.slice(0, 48),
      url: `https://example.com/item/${i}`,
      icon: LINK_ICONS[i % LINK_ICONS.length],
      highlight: i % 2 === 0,
    }));

    const stress: Profile = profileSchema.parse({
      slug: "stress-test",
      name: "MaxName-".padEnd(40, "X"),
      bio: "Bio-Content-".padEnd(280, "B"),
      status: "Status-".padEnd(60, "S"),
      avatar: "https://example.com/avatar.jpg",
      links,
      theme: {
        accent: "#123456",
        background: { type: "color", value: "#000000", blur: 40 },
        text: "dark",
        font: "jetbrains-mono",
        radius: 32,
      },
      effects: {
        cursor: "glow",
        particles: { enabled: true, density: 160 },
        tilt: true,
      },
    });

    const { container } = render(<ProfileView profile={stress} />);
    expect(container).toMatchSnapshot();
  });
});
