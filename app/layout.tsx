import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor/CustomCursor";
import ClientOnly from "@/components/CustomCursor/ClientOnly";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "FlowCraft AI | %s",
  description:
    "FlowCraft AI transforms natural language project briefs into interactive user flow diagrams with UI component suggestions, streamlining the UX design process.",
  keywords: [
    "UX design",
    "user flow",
    "AI design tool",
    "UX workflow",
    "wireframing",
    "prototyping",
    "design automation",
    "UI components",
  ],
  authors: [{ name: "CrackPots Team" }],
  creator: "CrackPots Team",
  publisher: "FlowCraft AI",
  robots: "index, follow",
  metadataBase: new URL("https://flowcraftai.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://flowcraftai.vercel.app",
    title: "FlowCraft AI | AI-Powered User Flow Generation",
    description:
      "Transform project briefs into interactive UX flows with AI. Design faster, collaborate better.",
    siteName: "FlowCraft AI",
    images: [
      {
        url: "https://your-domain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "FlowCraft AI - UX Flow Generation Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowCraft AI | AI-Powered User Flow Generation",
    description:
      "Transform project briefs into interactive UX flows with AI. Design faster, collaborate better.",
    images: ["https://your-domain.com/twitter-image.png"],
    creator: "@yourhandle",
  },
  viewport: "width=device-width, initial-scale=1",
  alternates: {
    canonical: "https://flowcraftai.vercel.app",
  },
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
