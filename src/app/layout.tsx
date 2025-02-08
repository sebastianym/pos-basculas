import type { Metadata } from "next";
import { NextUIProvider } from "@nextui-org/react";
import { ViewTransitions } from "next-view-transitions";
import { PortProvider } from "@/components/context/PortContext";
import "../assets/globals.css";

export const metadata: Metadata = {
  title: "POS System",
  description: "Simple POS System - created by Sebastián Yepes Marta +57 305 763 5018",
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
          <NextUIProvider>
            <PortProvider>{children}</PortProvider>
          </NextUIProvider>
          <script src="https://cdn.jsdelivr.net/npm/qz-tray/qz-tray.js" defer></script>
        </body>
      </html>
    </ViewTransitions>
  );
}
