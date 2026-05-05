import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Providers from "@/components/Providers"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: "Garuda Cyber Tes - Post Dashboard",
  description: "Simple and informative dashboard built with Next.js & DaisyUI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" 
      className={`${geistSans.variable} ${geistMono.variable} font-sans h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-base-100 flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1 container mx-auto p-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}