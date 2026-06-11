import type { Metadata } from "next";
import NotFoundContent from "@/components/NotFoundContent";

export const metadata: Metadata = {
  title: "404 — Page Not Found | Yugesh Bastola",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundContent />;
}
