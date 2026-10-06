import React, { isValidElement, memo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Components, ExtraProps } from "react-markdown";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CodeProps = ComponentProps<"code"> & ExtraProps;

const InlineCode = ({ node: _node, className, ...props }: CodeProps) => (
  <code
    className={cn("bg-muted text-foreground px-1.5 py-0.5 rounded-md text-[0.85em] border border-border/60 font-mono", className)}
    {...props}
  />
);

const CodeBlock = ({ className, children }: { className?: string; children?: ReactNode }) => {
  const language = /language-(\w+)/.exec(className ?? "")?.[1] ?? "text";
  const [isCopied, setIsCopied] = useState(false);
  // Highlighted children are React spans, so copy the rendered text instead.
  const codeRef = useRef<HTMLElement>(null);
  const t = useTranslations("notes.markdown");

  const handleCopy = () => {
    navigator.clipboard.writeText(codeRef.current?.textContent?.replace(/\n$/, "") ?? "");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg overflow-hidden my-5 border border-border bg-muted/40">
      <div className="flex items-center justify-between px-4 py-2 bg-muted text-muted-foreground text-xs font-sans">
        <span className="uppercase tracking-wider font-semibold">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          aria-label={t("copyCode")}
        >
          {isCopied ? <Check size={14} /> : <Copy size={14} />}
          {isCopied ? t("copied") : t("copy")}
        </button>
      </div>
      <pre className="overflow-x-auto !p-4 text-[13.5px] leading-relaxed !m-0 text-foreground font-mono">
        <code ref={codeRef} className={cn(className, "!p-0")}>
          {children}
        </code>
      </pre>
    </div>
  );
};

type WithChildren = { children?: ReactNode };

type AnchorProps = WithChildren & { href?: string };

const MarkdownComponents: Components = {
  // react-markdown v10 no longer flags inline code; only fenced blocks are wrapped in <pre>.
  pre: ({ children }: WithChildren) => {
    const code = isValidElement<CodeProps>(children) ? children.props : null;
    return <CodeBlock className={code?.className}>{code?.children}</CodeBlock>;
  },
  code: InlineCode,

  h1: ({ children }: WithChildren) => (
    <h1 className="text-xl font-bold text-foreground mt-5 mb-4 border-b border-border pb-3">
      {children}
    </h1>
  ),
  h2: ({ children }: WithChildren) => (
    <h2 className="text-base font-bold text-foreground mt-5 mb-2">
      {children}
    </h2>
  ),
  h3: ({ children }: WithChildren) => (
    <h3 className="text-sm font-semibold text-foreground mt-4 mb-2">
      {children}
    </h3>
  ),
  h4: ({ children }: WithChildren) => (
    <h4 className="text-sm font-semibold text-muted-foreground mt-4 mb-2">
      {children}
    </h4>
  ),

  p: ({ children }: WithChildren) => (
    <p className="text-foreground/90 my-3 leading-7">
      {children}
    </p>
  ),

  strong: ({ children }: WithChildren) => (
    <strong className="text-foreground font-semibold">{children}</strong>
  ),

  em: ({ children }: WithChildren) => (
    <em className="italic">{children}</em>
  ),

  a: ({ children, href }: AnchorProps) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary font-medium"
    >
      {children}
    </a>
  ),

  ul: ({ children }: WithChildren) => (
    <ul className="list-disc pl-5 my-3 space-y-1.5 text-foreground/90 marker:text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }: WithChildren) => (
    <ol className="list-decimal pl-5 my-3 space-y-1.5 text-foreground/90 marker:text-muted-foreground">
      {children}
    </ol>
  ),
  li: ({ children }: WithChildren) => (
    <li className="leading-7 pl-1">
      {children}
    </li>
  ),

  blockquote: ({ children }: WithChildren) => (
    <blockquote className="my-4 rounded-lg bg-muted/60 px-4 py-2 text-muted-foreground">
      {children}
    </blockquote>
  ),

  hr: () => <hr className="my-6 border-border" />,

  table: ({ children }: WithChildren) => (
    <div className="overflow-x-auto my-5 rounded-lg border border-border">
      <table className="min-w-full divide-y divide-border">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: WithChildren) => (
    <thead className="bg-muted">{children}</thead>
  ),
  th: ({ children }: WithChildren) => (
    <th className="px-4 py-2.5 text-left text-sm font-semibold text-foreground border-b border-border">
      {children}
    </th>
  ),
  td: ({ children }: WithChildren) => (
    <td className="px-4 py-2.5 text-sm text-muted-foreground border-b border-border">
      {children}
    </td>
  ),
  tbody: ({ children }: WithChildren) => (
    <tbody className="divide-y divide-border">{children}</tbody>
  ),
};

interface MarkdownRendererProps {
  content: string;
  className?: string;
  compact?: boolean;
}

export const MarkdownRenderer = memo(({
  content,
  className,
  compact = false
}: MarkdownRendererProps) => {
  return (
    <div className={cn(
      "w-full text-[15px] px-4 leading-relaxed text-foreground [&>:first-child]:mt-0 [&>:last-child]:mb-0",
      compact && "[&_p]:my-0 [&_ul]:my-0 [&_ol]:my-0 [&_h1]:my-0 [&_h2]:my-0 [&_h3]:my-0 [&_h4]:my-0 [&_blockquote]:my-0 [&_pre]:my-0 [&_hr]:my-2",
      className
    )}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={MarkdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

MarkdownRenderer.displayName = "MarkdownRenderer";
