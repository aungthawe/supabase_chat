import type { Metadata } from "next";
import { Toaster } from "sonner";
import { startPresence } from "@/lib/presence";
import { useUserStore } from "@/store/useStore";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat App",
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
        <Toaster position="top-center"></Toaster>
        {children}
      </body>
    </html>
  );
}
