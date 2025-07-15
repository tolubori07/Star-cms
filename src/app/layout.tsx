import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Mono, Bungee } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NavBarServer from "@/components/NavBarServer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const bungee = Bungee({
  variable: "--font-bungee",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brutalist-CMS",
  description: "A neobrutalist first CMS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrains.variable} ${bungee.variable} antialiased `}
      >
        <NavBarServer />
        <main className="px-16">
        {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
