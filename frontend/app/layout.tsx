// Directory: frontend/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"; // Import Sonner

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ashtavakra",
  description: "Experience Hubs Powered by Diverse Minds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}