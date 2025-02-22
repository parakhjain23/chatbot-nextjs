import React from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  prism,
  vscDarkPlus,
} from "react-syntax-highlighter/dist/esm/styles/prism";

// Import the languages you want to support
import js from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown";

// Register languages
SyntaxHighlighter.registerLanguage("javascript", js);
SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("markdown", markdown);

// CodeBlock component
export function CodeBlock({
  inline = false,
  className = "",
  children,
  isDark = false,
  ...props
}: {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
  isDark?: boolean;
}) {
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "text";

  return !inline ? (
    <div className="text-sm m-0 rounded-sm w-full">
      <SyntaxHighlighter
        style={isDark ? vscDarkPlus : prism}
        customStyle={isDark ? {} : { backgroundColor: "transparent" }}
        className="bg-white outline-none border-0 m-0"
        language={language}
        wrapLongLines
        codeTagProps={{
          style: { whiteSpace: "pre-wrap", backgroundColor: "transparent" },
        }}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
}
