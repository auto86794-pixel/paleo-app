import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";


export const metadata: Metadata = {
  title: "PaleoAI",
  description: "AI alapú paleo étrend és egészség asszisztens",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body className="bg-[#f8f6ef] text-[#111827]">
        <Navbar />

        <main>{children}</main>
      </body>
    </html>
  );
}