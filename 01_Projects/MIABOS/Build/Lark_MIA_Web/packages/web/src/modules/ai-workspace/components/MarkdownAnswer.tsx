import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

interface Props {
  markdown: string;
}

export function MarkdownAnswer({ markdown }: Props) {
  return (
    <div className="markdown-answer">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          h1: (props) => (
            <h1
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "#013652",
                margin: "16px 0 10px",
                lineHeight: 1.4,
              }}
              {...props}
            />
          ),
          h2: (props) => (
            <h2
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: "#013652",
                margin: "16px 0 10px",
                lineHeight: 1.4,
              }}
              {...props}
            />
          ),
          h3: (props) => (
            <h3
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#013652",
                margin: "14px 0 8px",
                lineHeight: 1.4,
              }}
              {...props}
            />
          ),
          p: (props) => (
            <p
              style={{
                fontSize: 14,
                color: "#013652",
                lineHeight: 1.6,
                margin: "0 0 10px",
              }}
              {...props}
            />
          ),
          ul: (props) => (
            <ul
              style={{
                paddingLeft: 22,
                margin: "0 0 10px",
                color: "#013652",
                fontSize: 14,
                lineHeight: 1.6,
              }}
              {...props}
            />
          ),
          ol: (props) => (
            <ol
              style={{
                paddingLeft: 22,
                margin: "0 0 10px",
                color: "#013652",
                fontSize: 14,
                lineHeight: 1.6,
              }}
              {...props}
            />
          ),
          li: (props) => <li style={{ marginBottom: 4 }} {...props} />,
          a: (props) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#2F64F6",
                textDecoration: "underline",
                fontWeight: 500,
              }}
            />
          ),
          strong: (props) => (
            <strong
              style={{ color: "#013652", fontWeight: 600 }}
              {...props}
            />
          ),
          em: (props) => <em style={{ color: "#3A6381" }} {...props} />,
          blockquote: (props) => (
            <blockquote
              style={{
                borderLeft: "3px solid #2F64F6",
                paddingLeft: 12,
                margin: "10px 0",
                color: "#3A6381",
                fontSize: 14,
                lineHeight: 1.6,
              }}
              {...props}
            />
          ),
          code: ({ className, children, ...rest }) => {
            const isBlock = (className ?? "").startsWith("language-");
            if (isBlock) {
              return (
                <code className={className} {...rest}>
                  {children}
                </code>
              );
            }
            return (
              <code
                style={{
                  background: "#F6F9FF",
                  color: "#013652",
                  padding: "2px 6px",
                  borderRadius: 4,
                  fontSize: 13,
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, monospace",
                }}
                {...rest}
              >
                {children}
              </code>
            );
          },
          pre: (props) => (
            <pre
              style={{
                background: "#013652",
                color: "#ECF4FF",
                padding: 16,
                borderRadius: 8,
                overflowX: "auto",
                fontSize: 13,
                lineHeight: 1.5,
                margin: "10px 0",
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
              {...props}
            />
          ),
          table: (props) => (
            <div style={{ overflowX: "auto", margin: "10px 0" }}>
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  fontSize: 13,
                  border: "1px solid rgba(47,100,246,0.16)",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
                {...props}
              />
            </div>
          ),
          thead: (props) => (
            <thead style={{ background: "#ECF4FF" }} {...props} />
          ),
          th: (props) => (
            <th
              style={{
                padding: "8px 12px",
                textAlign: "left",
                color: "#013652",
                fontWeight: 600,
                borderBottom: "1px solid rgba(47,100,246,0.16)",
              }}
              {...props}
            />
          ),
          td: (props) => (
            <td
              style={{
                padding: "8px 12px",
                color: "#013652",
                borderBottom: "1px solid rgba(47,100,246,0.08)",
              }}
              {...props}
            />
          ),
          hr: () => (
            <hr
              style={{
                border: "none",
                borderTop: "1px solid rgba(47,100,246,0.16)",
                margin: "16px 0",
              }}
            />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
