import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hidrin Adel Seno — Raum wird Geschichte",
  description: "Innenarchitektur, Kunst und Technologie. Arbeiten und Perspektiven von Hidrin Adel Seno.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">{children}</body>
    </html>
  );
}
