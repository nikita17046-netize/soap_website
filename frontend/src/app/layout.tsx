import type { Metadata } from "next";
import "./globals.css";
import "@mobile/responsive.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import ConditionalFooter from "@/components/ConditionalFooter";


export const metadata: Metadata = {
  title: "SaptAroma | Handcrafted Artisanal Soaps",
  description: "Experience the essence of nature with SaptAroma's premium handmade soaps, crafted with seven sacred botanicals and organic essential oils.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            <main>{children}</main>
            <ConditionalFooter />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

