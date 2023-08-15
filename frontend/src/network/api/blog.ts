import { BlogPost } from "@/models/blogPost";
import axiosApi from "@/network/axiosInstance";

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