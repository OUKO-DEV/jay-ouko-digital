import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Emmanuel Ouko | Digital Platform",
    template: "%s | Emmanuel Ouko"
  },
  description:
    "A professional digital platform for services, learning and client collaboration.",
  applicationName: "Emmanuel Ouko"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
