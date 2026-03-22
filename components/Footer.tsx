
export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 mt-20">
      <div className="container text-sm text-gray-400 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Yugesh Bastola. All rights reserved.</p>
        <p>Built with Next.js & Tailwind CSS.</p>
      </div>
    </footer>
  );
}
