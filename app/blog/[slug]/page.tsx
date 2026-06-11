import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { MDXRemote } from "@/components/MDXRemote";
import { Calendar, Clock, Tag, ArrowLeft } from "lucide-react";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  const baseUrl = "https://yugeshbastola.com.np";

  return {
    title: post.title,
    description: post.description,
    keywords: [...post.tags, "Yugesh Bastola", "Nepal", "Full Stack Developer"],
    authors: [{ name: "Yugesh Bastola", url: baseUrl }],
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${baseUrl}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: ["Yugesh Bastola"],
      tags: post.tags,
      images: [
        {
          url: `${baseUrl}/image.png`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      creator: "@yugeshbastola",
      images: [`${baseUrl}/image.png`],
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const baseUrl = "https://yugeshbastola.com.np";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Yugesh Bastola",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Yugesh Bastola",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/image.png`,
      },
    },
    image: `${baseUrl}/image.png`,
    url: `${baseUrl}/blog/${post.slug}`,
    keywords: post.tags.join(", "),
  };

  return (
    <div className="min-h-screen bg-[#050B18] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-6 py-32">
        {/* Back */}
        <Link
          href="/blog"
          className="text-[10px] uppercase tracking-[0.3em] text-cyan-500 font-black hover:text-cyan-400 transition-colors mb-10 inline-flex items-center gap-2"
        >
          <ArrowLeft size={10} /> All Posts
        </Link>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-8 mb-6">
          {post.tags.map((tag) => (
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
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-tight mb-6">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-5 text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-12 pb-8 border-b border-white/8">
          <span className="flex items-center gap-1.5">
            <Calendar size={10} />
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={10} />
            {post.readingTime}
          </span>
        </div>

        {/* Content */}
        <article className="prose prose-invert prose-cyan max-w-none
          prose-headings:font-black prose-headings:tracking-tight
          prose-h1:text-4xl prose-h2:text-2xl prose-h3:text-xl
          prose-p:text-gray-400 prose-p:leading-relaxed
          prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-white
          prose-code:text-cyan-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-[#0d1426] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
          prose-blockquote:border-l-cyan-500 prose-blockquote:text-gray-400
          prose-li:text-gray-400
          prose-hr:border-white/10">
          <MDXRemote source={post.content} />
        </article>

        {/* Footer CTA */}
        <div className="mt-20 pt-10 border-t border-white/8">
          <p className="text-gray-500 text-sm italic mb-6">
            Found this useful? Have questions or want to discuss?
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-cyan-500/30 text-cyan-400 text-[10px] uppercase tracking-[0.2em] font-black hover:bg-cyan-500/8 transition-all"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
}
