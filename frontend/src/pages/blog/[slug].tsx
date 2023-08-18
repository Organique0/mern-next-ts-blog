import { BlogPost } from "@/models/blogPost"
import { GetStaticPaths, GetStaticProps } from "next"
import * as BlogApi from "@/network/api/blog";
import Head from "next/head";
import styles from "@/styles/BlogPostPage.module.css";
import Link from "next/link";
import { formatDate } from "@/utils/utils";
import Image from "next/image";
import { NotFoundError } from "@/network/http-errors";

export const getStaticPaths: GetStaticPaths = async () => {
    const slugs = await BlogApi.getAllBlogPostSlugs();
    const paths = slugs.map(slug => ({ params: { slug } }));

    return {
        paths,
        fallback: "blocking",
    }
}

export const getStaticProps: GetStaticProps<BlogPostPage> = async ({ params }) => {
    try {
        const slug = params?.slug?.toString();
        if (!slug) throw Error("slug is undefined");

        const post = await BlogApi.getBlogPostBySlug(slug);
        return { props: { post } };
    } catch (error) {
        if (error instanceof NotFoundError) {
            return { notFound: true }
        } else {
            throw error;
        }
    }

}


interface BlogPostPage {
    post: BlogPost,
}

export default function BlogPostPage({ post: { _id, slug, title, summary, body, featuredImageUrl, createdAt, updatedAt } }: BlogPostPage) {

    const createdUpdatedText = updatedAt > createdAt
        ? <>updated <time dateTime={updatedAt}>{formatDate(updatedAt)}</time></>
        : <>created <time dateTime={createdAt}>{formatDate(createdAt)}</time></>

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={summary} />
            </Head>

            <div className={styles.container}>
                <div className="mb-4">
                    <Link href="/blog">Back to blogs</Link>
                </div>
                <article>
                    <div className="d-flex flex-column align-items-center">
                        <h1 className="text-center mb-3">{title}</h1>
                        <p className="text-center mb-3 h5">{summary}</p>
                        <span className="text-muted">{createdUpdatedText}</span>
                        <div className={styles.featuredImageWrapper}>
                            <Image src={featuredImageUrl} fill priority sizes="(max-width: 786px) 100vw, 700px" className="rounded" alt="Blog post featured image" />
                        </div>
                    </div>
                    <div>
                        {body}
                    </div>
                </article>
            </div>
        </>
    )
}