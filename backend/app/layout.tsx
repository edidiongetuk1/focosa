import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FOCOSA Hub API",
  description: "Faculty of Computing Students Association - Backend API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
