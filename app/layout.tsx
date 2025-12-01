import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import NavProfile from "@/components/NavProfile";

export const metadata: Metadata = {
  title: "Chat with Love",
  description: "Supabase chat app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavProfile />

        <Toaster position="top-center"></Toaster>

        <main className="pt-14 min-h-[calc(100vh-4rem)]">{children}</main>
      </body>
    </html>
  );
}
