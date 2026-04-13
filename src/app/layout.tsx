import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WLF Investigation — Follow the Money",
  description:
    "Interactive investigation mapping the people, money flows, and foreign government connections behind Trump's World Liberty Financial and $TRUMP coin.",
  openGraph: {
    title: "WLF Investigation — Follow the Money",
    description:
      "Who are the people behind Trump's crypto empire? Explore the network.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 2000,
        height: 1530,
        alt: "Network graph showing financial connections between Trump, foreign governments, and World Liberty Financial",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WLF Investigation — Follow the Money",
    description:
      "Interactive investigation mapping the people, money flows, and foreign government connections behind Trump's crypto empire.",
    images: ["/og-image.png"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-gray-950 text-gray-100">
        {children}
      </body>
    </html>
  );
}
