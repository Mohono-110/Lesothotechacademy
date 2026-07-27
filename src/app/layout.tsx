import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lesotho Tech Academy | Learn Code Innovate - Premier IT Training in Leribe, Lesotho",
  description:
    "Lesotho Tech Academy offers professional IT courses in Web Development, CMS Development, Computer Networks, and Business Development Systems. Based in Leribe 300 District, Lesotho. Enroll today for online and in-person classes.",
  keywords: [
    "Lesotho Tech Academy",
    "IT courses Lesotho",
    "Web Development Lesotho",
    "Computer Networks Lesotho",
    "CMS Development Lesotho",
    "Business Development Systems",
    "Leribe 300 District",
    "Technology training Lesotho",
    "Online IT courses",
    "M300 registration",
    "M-Pesa payment Lesotho",
    "EcoCash payment Lesotho",
    "Lesotho education",
    "IT skills Africa",
    "Learn to code Lesotho",
    "Relebohile Mohono",
    "LSMTA Science Fair",
    "Lesotho technology school",
  ],
  authors: [
    { name: "Relebohile Joseph Mohono", url: "https://lesothotechacademy.com" },
  ],
  creator: "Lesotho Tech Academy",
  publisher: "Lesotho Tech Academy",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Lesotho Tech Academy | Learn Code Innovate",
    description:
      "Premier IT training institution in Lesotho offering Web Development, CMS Development, Computer Networks, and Business Development Systems courses.",
    url: "https://lesothotechacademy.com",
    siteName: "Lesotho Tech Academy",
    type: "website",
    locale: "en_LS",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Lesotho Tech Academy Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lesotho Tech Academy | Learn Code Innovate",
    description:
      "Premier IT training institution in Lesotho. Learn Web Development, CMS, Computer Networks & Business Development Systems.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://lesothotechacademy.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="geo.region" content="LS-LR" />
        <meta name="geo.placename" content="Leribe, Lesotho" />
        <meta name="theme-color" content="#4CAF50" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
