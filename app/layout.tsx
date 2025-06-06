import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import "./globals.css";
import { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Provider from "./Provider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "WriteWrizard",
  description: "Your go-to collaborative writing platform",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/assets/images/logo.png", sizes: "192x192" },
    ],
    apple: "/assets/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#000000",
          fontSize: "16px",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" href="/assets/images/logo.png" type="image/png" />
          <link rel="apple-touch-icon" href="/assets/images/logo.png" />
        </head>
        <body
          className={cn(
            "min-h-screen font-sans antialiased",
            fontSans.variable
          )}
        >
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
