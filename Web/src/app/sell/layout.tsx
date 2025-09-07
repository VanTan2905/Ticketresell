import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import React from "react";
export const metadata = {
  title: "Ticket Resell - Buy & Sell Event Tickets Legitimately",
  description: "Shop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar page={"ticket"} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
