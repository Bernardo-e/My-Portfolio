import type { Metadata } from "next";
import { Outfit, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Heading & Display Font: Outfit (geometric, clean, modern)
const fontDisplay = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Body Font: Inter (highly legible, optimized)
const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Monospace Font: JetBrains Mono (tech, code, product details)
const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bernardo | Full-Stack Developer",
  description: "Computer Science student and Full Stack Developer building modern digital products like Campus Orbit, ShadowNet AI, BERD AI Resume, BERD Habit, BERD Focus, BERD To Do List, and BERD Vault.",
  keywords: [
    "Bernardo",
    "Full Stack Developer",
    "B.E. Computer Science",
    "Sathyabama Institute of Science and Technology",
    "Campus Orbit",
    "ShadowNet AI",
    "BERD AI Resume",
    "BERD Habit",
    "Next.js",
    "FastAPI",
    "React"
  ],
  authors: [{ name: "Bernardo" }],
  creator: "Bernardo",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://github.com/Bernardo-e",
    title: "Bernardo | Full-Stack Developer",
    description: "Explore the portfolio of Bernardo, a Full Stack Developer from Sathyabama Institute of Science and Technology.",
    siteName: "Bernardo Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bernardo | Full-Stack Developer",
    description: "Computer Science student and Full Stack Developer building modern digital products.",
    creator: "@Bernardo_e",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground font-sans antialiased selection:bg-secondary selection:text-white">
        {children}
      </body>
    </html>
  );
}
