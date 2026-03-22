import type { Metadata } from "next";
import "../styles/globals.css";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Yugesh Bastola — Full Stack Developer",
  description: "Portfolio of Yugesh Bastola",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#050505] text-white antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
