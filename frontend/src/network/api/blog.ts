import { BlogPost } from "@/models/blogPost";
import axiosApi from "@/network/axiosInstance";


export async function getBlogPosts() {
    const response = await axiosApi.get<BlogPost[]>("/posts");
    return response.data
}

interface CreateBlogPostValues {
    slug: string,
    title:string,
    summary:string,
    body:string,
}

export async function createBlogPost(input:CreateBlogPostValues) {
    const response = await axiosApi.post<BlogPost>("/posts", input);
    return response.data;
}