import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { ReactNode } from "react";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }: { children?: ReactNode }) => (
            <h1 className="text-2xl font-bold mb-4 text-foreground mt-6 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }: { children?: ReactNode }) => (
            <h2 className="text-xl font-semibold mb-3 text-foreground mt-6">
              {children}
            </h2>
          ),
          h3: ({ children }: { children?: ReactNode }) => (
            <h3 className="text-lg font-medium mb-2 text-foreground mt-4">
              {children}
            </h3>
          ),
          p: ({ children }: { children?: ReactNode }) => (
            <p className="mb-4 leading-relaxed text-foreground/90">{children}</p>
          ),
          ul: ({ children }: { children?: ReactNode }) => (
            <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>
          ),
          ol: ({ children }: { children?: ReactNode }) => (
            <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>
          ),
          li: ({ children }: { children?: ReactNode }) => (
            <li className="text-foreground/90">{children}</li>
          ),
          code: ({ className, children, ...props }: any) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-muted text-purple-600 dark:text-purple-400 text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return <code className={className} {...props}>{children}</code>;
          },
          pre: ({ children }: { children?: ReactNode }) => (
            <pre className="bg-muted rounded-lg p-4 overflow-x-auto mb-4 border">
              {children}
            </pre>
          ),
          blockquote: ({ children }: { children?: ReactNode }) => (
            <blockquote className="border-l-4 border-purple-500 pl-4 py-2 my-4 bg-purple-50 dark:bg-purple-950/30 italic">
              {children}
            </blockquote>
          ),
          strong: ({ children }: { children?: ReactNode }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }: { children?: ReactNode }) => <em className="italic">{children}</em>,
          hr: () => <hr className="my-6 border-muted" />,
          table: ({ children }: { children?: ReactNode }) => (
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse border border-border">
                {children}
              </table>
            </div>
          ),
          th: ({ children }: { children?: ReactNode }) => (
            <th className="border border-border bg-muted px-3 py-2 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }: { children?: ReactNode }) => (
            <td className="border border-border px-3 py-2">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};