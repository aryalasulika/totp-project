import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Google Fonts
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Research environment for TOTP artifacts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
