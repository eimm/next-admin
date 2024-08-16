import type { Metadata } from "next";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { Button } from "@/components/ui/button";
import StoreModal from "@/components/modals/StoreModal";
import { ToastProvider } from "@/components/toast/ToastProvider";
import { ThemeProvider } from "@/components/Theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
