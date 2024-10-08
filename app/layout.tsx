import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import StoreModal from "@/components/modals/StoreModal";
import { ThemeProvider } from "@/components/Theme";
import { ToastProvider } from "@/components/toast/ToastProvider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next Admin",
  description: "Next admin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <main>
            <ToastProvider />
            <StoreModal />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
