import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Optimized - AI Workflow Implementation for Your Business",
  description: "The authority for all things AI optimization. Drive real results with custom AI solutions for your business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/AIOFavV2.svg" type="image/svg+xml" />
        <link
          href="https://fonts.googleapis.com/css2?family=Century+Gothic:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
