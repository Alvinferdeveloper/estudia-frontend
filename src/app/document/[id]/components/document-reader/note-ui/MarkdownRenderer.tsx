import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Check, Copy } from "lucide-react";
import { JetBrains_Mono, Inter } from "next/font/google";
import type { Components } from "react-markdown";
import type { ClassAttributes, HTMLAttributes, ReactNode } from "react";
import type { ExtraProps } from "react-markdown";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

type CodeProps = ClassAttributes<HTMLElement> &
  HTMLAttributes<HTMLElement> &
  ExtraProps & {
    inline?: boolean;
  };

const CodeBlock = ({ inline, className, children, ...props }: CodeProps) => {
  const match = /language-(\w+)/.exec(className ?? "");
  const language = match ? match[1] : "text";
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    const codeText = String(children).replace(/\n$/, "");
    navigator.clipboard.writeText(codeText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!inline) {
    return (
      <div className="relative rounded-lg overflow-hidden my-6 border border-zinc-800 bg-[#1a1b26]">
        <div className="flex items-center justify-between px-4 py-2 bg-[#1f2335] text-zinc-400 text-xs font-sans">
          <span className="uppercase tracking-wider font-semibold">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 hover:text-zinc-100 transition-colors"
            aria-label="Copiar código"
          >
            {isCopied ? <Check size={14} /> : <Copy size={14} />}
            {isCopied ? "Copiado" : "Copiar"}
          </button>
        </div>
        <pre className={`overflow-x-auto !p-4 text-[13.5px] leading-relaxed !m-0 text-zinc-50 ${jetbrainsMono.className}`}>
          <code className={`${className ?? ""} !p-0`} {...props}>
            {children}
          </code>
        </pre>
      </div>
    );
  }

  return (
    <code
      className={`bg-zinc-800/60 text-zinc-200 px-1.5 py-0.5 rounded-md text-[0.85em] border border-zinc-700 ${jetbrainsMono.className}`}
      {...props}
    >
      {children}
    </code>
  );
};

type WithChildren = { children?: ReactNode };

type AnchorProps = WithChildren & { href?: string };

const MarkdownComponents: Components = {
  pre: ({ children }: WithChildren) => <>{children}</>,
  code: CodeBlock,

  h1: ({ children }: WithChildren) => (
    <h1 className="text-xl font-bold text-zinc-100 mt-5 mb-5 border-b border-zinc-700/50 pb-3">
      {children}
    </h1>
  ),
  h2: ({ children }: WithChildren) => (
    <h2 className="text-md font-bold text-zinc-100 mt-4 mb-2">
      {children}
    </h2>
  ),
  h3: ({ children }: WithChildren) => (
    <h3 className="text-sm font-semibold text-zinc-200 mt-4 mb-2">
      {children}
    </h3>
  ),
  h4: ({ children }: WithChildren) => (
    <h4 className="text-base font-semibold text-zinc-300 mt-5 mb-2">
      {children}
    </h4>
  ),

  p: ({ children }: WithChildren) => (
    <p className="text-zinc-300 my-4 leading-7">
      {children}
    </p>
  ),

  strong: ({ children }: WithChildren) => (
    <strong className="text-zinc-100 font-semibold">{children}</strong>
  ),

  em: ({ children }: WithChildren) => (
    <em className="text-zinc-400 italic">{children}</em>
  ),

  a: ({ children, href }: AnchorProps) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 hover:text-blue-300 underline underline-offset-2 font-medium"
    >
      {children}
    </a>
  ),

  ul: ({ children }: WithChildren) => (
    <ul className="list-disc list-inside my-4 space-y-2 text-zinc-300 marker:text-zinc-500">
      {children}
    </ul>
  ),
  ol: ({ children }: WithChildren) => (
    <ol className="list-decimal list-inside my-4 space-y-2 text-zinc-300 marker:text-zinc-500">
      {children}
    </ol>
  ),
  li: ({ children }: WithChildren) => (
    <li className="leading-7 text-zinc-300 ml-2">
      {children}
    </li>
  ),

  blockquote: ({ children }: WithChildren) => (
    <blockquote className="border-l-4 border-blue-500/60 pl-4 py-2 my-5 italic text-zinc-400 bg-zinc-800/30 rounded-r-lg">
      {children}
    </blockquote>
  ),

  hr: () => <hr className="my-6 border-zinc-700" />,

  table: ({ children }: WithChildren) => (
    <div className="overflow-x-auto my-6 rounded-lg border border-zinc-700">
      <table className="min-w-full divide-y divide-zinc-700">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: WithChildren) => (
    <thead className="bg-zinc-800/60">{children}</thead>
  ),
  th: ({ children }: WithChildren) => (
    <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-200 border-b border-zinc-700">
      {children}
    </th>
  ),
  td: ({ children }: WithChildren) => (
    <td className="px-4 py-3 text-sm text-zinc-400 border-b border-zinc-800">
      {children}
    </td>
  ),
  tbody: ({ children }: WithChildren) => (
    <tbody className="divide-y divide-zinc-800">{children}</tbody>
  ),
};

interface MarkdownRendererProps {
  content: string;
  className?: string;
  compact?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className,
  compact = false 
}) => {
  return (
    <div className={`
      w-full text-[15px] px-4 leading-relaxed 
      ${inter.className} 
      ${compact ? "[&_p]:my-0 [&_ul]:my-0 [&_ol]:my-0 [&_h1]:my-0 [&_h2]:my-0 [&_h3]:my-0 [&_h4]:my-0 [&_blockquote]:my-0 [&_pre]:my-0 [&_hr]:my-2" : ""}
      ${className ?? ""}
    `}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={MarkdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
