import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor/CustomCursor";
import ClientOnly from "@/components/CustomCursor/ClientOnly";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Vercel Hackathon",
  description: "Made by the team CrackPots",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
        <ClientOnly>
          <CustomCursor />
        </ClientOnly>
        <Analytics />
      </body>
    </html>
  );
}
