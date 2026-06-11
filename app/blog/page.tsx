import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { Calendar, Clock, Tag, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | Yugesh Bastola",
  description:
    "Technical articles on Next.js, TypeScript, SaaS architecture, and full-stack development by Yugesh Bastola — Full Stack Developer from Kathmandu, Nepal.",
  alternates: {
    canonical: "https://yugeshbastola.com.np/blog",
  },
  openGraph: {
    title: "Blog | Yugesh Bastola",
    description:
      "Technical articles on Next.js, TypeScript, SaaS architecture, and full-stack development.",
    url: "https://yugeshbastola.com.np/blog",
    type: "website",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#050B18] text-white">
      <div className="max-w-4xl mx-auto px-6 py-32">
        {/* Header */}
        <div className="mb-16">
          <Link
            href="/"
            className="text-[10px] uppercase tracking-[0.3em] text-cyan-500 font-black hover:text-cyan-400 transition-colors mb-6 inline-flex items-center gap-2"
          >
            ← Back to Portfolio
          </Link>
          <h1 className="text-5xl sm:text-6xl font-black italic uppercase tracking-tighter leading-none mt-4">
            Dev{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(95deg, #00BFFF, #2563EB)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Blog:
            </span>
          </h1>
          <div
            className="w-14 h-[2px] rounded-full mt-4"
            style={{ background: "linear-gradient(90deg, #7C3AED, #00BFFF)" }}
          />
          <p className="text-gray-500 mt-4 text-sm italic">
            Practical articles on Next.js, TypeScript, SaaS architecture, and
            full-stack development.
          </p>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <p className="text-gray-600 italic">No posts yet. Check back soon.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <article
                  className="group p-8 rounded-2xl border border-white/8 bg-white/[0.02] hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer"
                >
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] font-black text-cyan-400/70 border border-cyan-500/20 px-2.5 py-1 rounded-full bg-cyan-500/5"
                      >
                        <Tag size={8} />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors leading-snug mb-3">
                    {post.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">
                    {post.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5 text-[10px] text-gray-600 uppercase tracking-widest font-bold">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={10} />
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={10} />
                        {post.readingTime}
                      </span>
                    </div>
                    <span className="text-cyan-500/60 group-hover:text-cyan-400 transition-colors flex items-center gap-1 text-[10px] uppercase tracking-widest font-black">
                      Read <ArrowRight size={10} />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
