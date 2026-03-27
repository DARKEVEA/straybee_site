import type { Metadata } from "next";
import { IBM_Plex_Sans, Space_Mono } from "next/font/google";
import "@/app/globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex",
  display: "swap",
  weight: ["400", "500", "700"]
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
  weight: ["400", "700"]
});

export const metadata: Metadata = {
  title: "Stray Bee / Ordered Chaos",
  description:
    "A bilingual personal portfolio blending Swiss grid systems, Dada collage, and Constructivist geometry."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${ibmPlexSans.variable} ${spaceMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
