import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Mono, Bungee } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NavBarServer from "@/components/NavBarServer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSideBarServer from "@/components/AppSideBarServer";
import NavBar from "@/components/NavBarClient";
import { ThemeProvider } from "@/components/theme-provider";

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
  title: "Star-CMS",
  description: "A CMS for Stars",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrains.variable} ${bungee.variable} antialiased `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSideBarServer />
            <SidebarInset className="bg-bg">
              <NavBar />
              <main className="px-4 pt-4">{children}</main>
              <Toaster />
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
