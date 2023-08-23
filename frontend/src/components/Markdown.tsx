/* eslint-disable @next/next/no-img-element */
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import styles from "@/styles/Markdown.module.css";

interface MarkdownProps {
    children: string,
}

//custom markdown implementaion with cool plugins
export default function Markdown({ children }: MarkdownProps) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm, [remarkToc, { maxDepth: 3, tight: true }]]}
            rehypePlugins={[rehypeSlug]}
            components={{
                img: (props) => (
                    <span >
                        <a href={props.src} target="_blank" rel="noreferrer" className={styles.imageWrapper}>
                            <img {...props} alt={props.alt ?? ""} />
                        </a>
                    </span>
                )
            }}
        >
            {children}
        </ReactMarkdown>
    )
}