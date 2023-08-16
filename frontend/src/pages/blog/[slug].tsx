import { BlogPost } from "@/models/blogPost"
import { GetStaticPaths, GetStaticProps } from "next"
import * as BlogApi from "@/network/api/blog";

export const getStaticPaths: GetStaticPaths = async () => {
    const slugs = await BlogApi.getAllBlogPostSlugs();
    const paths = slugs.map(slug => ({ params: { slug } }));

    return {
        paths,
        fallback: "blocking",
    }
}

export const getStaticProps: GetStaticProps<BlogPostPage> = async ({ params }) => {
    const slug = params?.slug?.toString();
    if (!slug) throw Error("slug is undefined");

    const post = await BlogApi.getBlogPostBySlug(slug);
    return { props: { post } };
}


interface BlogPostPage {
    post: BlogPost,
}

export default function BlogPostPage({ post }: BlogPostPage) {
    return (
        <>
            {JSON.stringify(post)}
        </>
    )
}