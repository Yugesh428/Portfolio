"use client";

import { MDXRemote as NextMDXRemote, type MDXRemoteProps } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { use } from "react";

type Props = {
  source: string;
};

async function getSerializedMDX(source: string) {
  return serialize(source, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeHighlight],
    },
  });
}

export function MDXRemote({ source }: Props) {
  const serialized = use(getSerializedMDX(source));
  return <NextMDXRemote {...serialized} />;
}
