import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "relic",
  description: "Self-hosted bio pages. Open source, no watermark, no JavaScript required.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
