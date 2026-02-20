import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rayaan Attari — ML Engineer | Healthcare AI | Fintech | Columbia CS",
  description:
    "Portfolio of Rayaan Attari — Machine Learning Engineer with 3+ years of experience building real-world AI systems across healthcare, fintech, and enterprise software. MS CS @ Columbia.",
  keywords: [
    "Machine Learning Engineer",
    "AI Engineer",
    "Healthcare AI",
    "Fintech ML",
    "Columbia University",
    "Software Engineer",
    "LLM",
    "PyTorch",
    "Portfolio",
    "Rayaan Attari",
  ],
  authors: [{ name: "Rayaan Attari" }],
  openGraph: {
    title: "Rayaan Attari — ML Engineer",
    description:
      "Machine Learning Engineer building production AI systems across healthcare, fintech, and enterprise software. MS CS @ Columbia.",
    type: "website",
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
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
