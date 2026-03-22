// app/layout.tsx
import type { Metadata } from "next";
import "../styles/globals.css"; // ✅ works if app/globals.css exists
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Yugesh Bastola — Full Stack Developer",
  description:
    "Portfolio website of Yugesh Bastola (Full Stack Developer: Node.js, React, Next.js, TypeScript, MSSQL).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
