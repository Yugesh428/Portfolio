import type { Metadata } from "next";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Chatbot from "../components/Chatbot";
import PageLoader from "../components/PageLoader";
import ScrollProgress from "../components/ScrollProgress";
import { Analytics } from "@vercel/analytics/react";

const BASE_URL = "https://yugeshbastola.com.np";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Yugesh Bastola | Full Stack Developer & SaaS Specialist — Nepal",
    template: "%s | Yugesh Bastola",
  },
  description:
    "Yugesh Bastola is a Full Stack Developer from Kathmandu, Nepal, specializing in Next.js, Node.js, TypeScript, and multi-tenant SaaS architecture. Intern at Digital Pathshala. Available for freelance and full-time roles.",
  keywords: [
    "Yugesh Bastola",
    "Full Stack Developer Nepal",
    "Full Stack Developer Kathmandu",
    "Next.js Developer Nepal",
    "Node.js Developer Nepal",
    "React Developer Nepal",
    "TypeScript Developer",
    "SaaS Developer Nepal",
    "Multi-tenant SaaS",
    "Software Engineer Nepal",
    "Web Developer Nepal",
    "Digital Pathshala",
    "Aqore Software",
    "TechSpire College",
    "Junior Developer Nepal",
    "Freelance Developer Nepal",
    "yugeshbastola",
    "yugesh bastola portfolio",
  ],
  authors: [{ name: "Yugesh Bastola", url: BASE_URL }],
  creator: "Yugesh Bastola",
  publisher: "Yugesh Bastola",
  category: "technology",
  openGraph: {
    title: "Yugesh Bastola | Full Stack Developer & SaaS Specialist",
    description:
      "Full Stack Developer from Nepal building multi-tenant SaaS platforms, enterprise backends, and scalable web apps with Next.js, Node.js, and TypeScript.",
    url: BASE_URL,
    siteName: "Yugesh Bastola — Portfolio",
    images: [
      {
        url: `${BASE_URL}/image.png`,
        width: 1200,
        height: 630,
        alt: "Yugesh Bastola - Full Stack Developer from Nepal",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yugesh Bastola | Full Stack Developer & SaaS Specialist",
    description:
      "Full Stack Developer from Nepal building multi-tenant SaaS platforms with Next.js, Node.js, and TypeScript.",
    images: [`${BASE_URL}/image.png`],
    creator: "@yugeshbastola",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: "",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Yugesh Bastola",
  url: BASE_URL,
  image: `${BASE_URL}/image.png`,
  jobTitle: "Full Stack Developer",
  description:
    "Full Stack Developer from Kathmandu, Nepal specializing in Next.js, Node.js, TypeScript, and multi-tenant SaaS architecture.",
  email: "bastolayugesh2@gmail.com",
  telephone: "+977-9812124264",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kathmandu",
    addressCountry: "NP",
  },
  sameAs: [
    "https://github.com/Yugesh428",
    "https://www.linkedin.com/in/yugesh-bastola-315638317/",
  ],
  knowsAbout: [
    "Next.js",
    "Node.js",
    "TypeScript",
    "React",
    "MySQL",
    "MSSQL",
    "SaaS Architecture",
    "Multi-tenant Systems",
    "Full Stack Development",
    "Java",
    "Spring Boot",
  ],
  alumniOf: [
    {
      "@type": "EducationalOrganization",
      name: "TechSpire College",
      address: { "@type": "PostalAddress", addressLocality: "Kathmandu" },
    },
    {
      "@type": "EducationalOrganization",
      name: "Digital Pathshala",
      address: { "@type": "PostalAddress", addressLocality: "Kathmandu" },
    },
  ],
  worksFor: {
    "@type": "Organization",
    name: "Digital Pathshala",
    url: "https://digitalpathshala.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#050505] text-white antialiased">
        <PageLoader />
        <ScrollProgress />
        <Navbar />
        {children}
        <Chatbot />
        <Analytics />
      </body>
    </html>
  );
}
