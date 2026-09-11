import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SONIQCX | Performance in every conversation",
  description: "Human-led. AI-enhanced. Revenue accountable. Discover a different approach to customer experience with SONIQCX.",
  icons: {
    icon: "/assets/submark.webp",
    shortcut: "/assets/submark.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}<noscript><style>{`
        .signal-film{height:auto!important}.film-stage{position:relative!important;height:auto!important;padding-top:140px}.scene-copy,.scene-copy:not(.intro-copy){position:relative!important;inset:auto!important;opacity:1!important;visibility:visible!important;transform:none!important;padding:50px 7%;min-height:460px}.scene-fallback{height:680px;opacity:.35}.motion-control{display:none}
      `}</style></noscript></body>
    </html>
  );
}
