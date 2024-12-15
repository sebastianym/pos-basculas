import type { Metadata } from "next";
import { NextUIProvider } from "@nextui-org/react";
import { ViewTransitions } from "next-view-transitions";
import "../assets/globals.css";

export const metadata: Metadata = {
  title: "POS System",
  description: "Simple POS System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body>
          <NextUIProvider>{children}</NextUIProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
