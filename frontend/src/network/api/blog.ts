import { BlogPost } from "@/models/blogPost";
import axiosApi from "@/network/axiosInstance";


export async function getBlogPosts() {
    const response = await axiosApi.get<BlogPost[]>("/posts");
    return response.data;
}

export async function getBlogPostBySlug(slug:string) {
    const response = await axiosApi.get<BlogPost>("/posts/post/"+slug);
    return response.data;
}

export async function getAllBlogPostSlugs() {
    const response = await axiosApi.get<string[]>("/posts/slugs/");
    return response.data;
}

interface CreateBlogPostValues {
    slug: string,
    title:string,
    summary:string,
    body:string,
    featuredImage: File,
}

export async function createBlogPost(input:CreateBlogPostValues) {
    const formData = new FormData();

    Object.entries(input).forEach(([key,value]) => {
        formData.append(key, value);
    });

    const response = await axiosApi.post<BlogPost>("/posts", formData);
    return response.data;
}