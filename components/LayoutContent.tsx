"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Chatbot from "./Chatbot";
import ScrollProgress from "./ScrollProgress";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth') || pathname?.startsWith('/dashboard') || pathname?.startsWith('/portal');

  return (
    <>
      {!isAuthPage && <ScrollProgress />}
      {!isAuthPage && <Navbar />}
      {children}
      {!isAuthPage && <Footer />}
      {!isAuthPage && <Chatbot />}
    </>
  );
}
