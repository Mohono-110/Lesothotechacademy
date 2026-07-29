import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import LayoutWrapper from "@/components/shared/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lesotho Tech Academy | Learn Code Innovate - Premier IT Training in Leribe, Lesotho",
    template: "%s | Lesotho Tech Academy",
  },
  description:
    "Lesotho Tech Academy offers professional IT courses in Web Development (M2600/3mo), Computer Networks (M3500/6mo), CMS Development (M4000/6mo), and Business Development Systems (M2000/3mo). Based in Leribe 300 District, Lesotho. Online classes available. Register with M300.",
  keywords: [
    "Lesotho Tech Academy",
    "IT courses Lesotho",
    "Web Development Lesotho M2600",
    "Computer Networks Lesotho M3500",
    "CMS Development Lesotho M4000",
    "Business Development Systems M2000",
    "Leribe 300 District",
    "Technology training Lesotho",
    "Online IT courses Lesotho",
    "M300 registration fee",
    "M-Pesa payment Lesotho",
    "EcoCash payment Lesotho",
    "Lesotho education",
    "IT skills Africa",
    "Learn to code Lesotho",
    "Relebohile Mohono",
    "LSMTA Science Fair",
    "Millicent Academy Junior School",
    "3 month web development course",
    "6 month computer networks course",
  ],
  authors: [{ name: "Relebohile Joseph Mohono" }],
  creator: "Lesotho Tech Academy",
  publisher: "Lesotho Tech Academy",
  icons: { icon: "/logo.png", apple: "/logo.png" },
  openGraph: {
    title: "Lesotho Tech Academy | Learn Code Innovate",
    description:
      "Premier IT training institution in Lesotho. Web Development, CMS, Computer Networks & Business Development Systems. Register for M300.",
    url: "https://lesothotechacademy.com",
    siteName: "Lesotho Tech Academy",
    type: "website",
    locale: "en_LS",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Lesotho Tech Academy Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lesotho Tech Academy | Learn Code Innovate",
    description:
      "Premier IT training in Lesotho. Web Dev, CMS, Networks & Business Systems.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="geo.region" content="LS-LR" />
        <meta name="geo.placename" content="Leribe, Lesotho" />
        <meta name="theme-color" content="#4CAF50" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <LayoutWrapper>{children}</LayoutWrapper>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
