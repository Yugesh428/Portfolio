import type { Metadata } from "next";
import "../styles/globals.css";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: {
    default: "Yugesh Bastola | Full Stack Developer",
    template: "%s | Yugesh Bastola",
  },
  description:
    "Yugesh Bastola is a Full Stack Developer specializing in React, Next.js, Node.js, and multi-tenant SaaS applications. Based in Nepal.",
  keywords: [
    "Yugesh Bastola",
    "Full Stack Developer Nepal",
    "Next.js Developer",
    "SaaS Specialist",
    "Nodejs Developer",
  ],
  authors: [{ name: "Yugesh Bastola" }],
  openGraph: {
    title: "Yugesh Bastola | Full Stack Developer",
    description:
      "Architecting scalable multi-tenant SaaS solutions with React, Next.js, and Node.js.",
    url: "https://yugeshbastola.vercel.app/",
    siteName: "Yugesh Bastola Portfolio",
    images: [
      {
        url: "https://yugeshbastola.vercel.app/image.png",
        width: 1200,
        height: 630,
        alt: "Yugesh Bastola - Full Stack Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
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
