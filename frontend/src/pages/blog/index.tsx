import { BlogPost } from "@/models/blogPost"
import { GetServerSideProps } from "next"
import Head from "next/head"
import * as BlogApi from "@/network/api/blog";
import BlogPostGrid from "@/components/BlogPostGrid";


export const getServerSideProps: GetServerSideProps<BlogPageProps> = async () => {
    const posts = await BlogApi.getBlogPosts();
    return { props: { posts } };
}

interface BlogPageProps {
    posts: BlogPost[],
}

export default function BlogPage({ posts }: BlogPageProps) {
    return (
        <>
            <Head>
                <title>blogs</title>
            </Head>
            <div>
                <h1>blogs</h1>
                <BlogPostGrid posts={posts} />
            </div>
        </>
    )
}