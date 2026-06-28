import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/layout/Providers";
import ChatWidget from "@/components/chatbot/ChatWidget";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Maharashtra Adventures",
  description: "Discover, compare, and book adventure experiences in Maharashtra.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
