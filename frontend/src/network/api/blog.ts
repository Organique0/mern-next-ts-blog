import { BlogPost, BlogPostPage } from "@/models/blogPost";
import axiosApi from "@/network/axiosInstance";
import { AxiosError } from "axios";
import toast from "react-hot-toast";


export async function getBlogPosts(page:number = 1) {
    const response = await axiosApi.get<BlogPostPage>("/posts?page="+page);
    return response.data;
}

export async function getBlogPostsByUser(userId:string,page:number = 1) {
    const response = await axiosApi.get<BlogPostPage>(`/posts?authorId=${userId}&page=${page}`);
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

interface UpdateBlogPostValues {
    slug: string,
    title:string,
    summary:string,
    body:string,
    featuredImage?: File,
}

export async function updateBlogPost(blogPostId:string, input:UpdateBlogPostValues) {
    const formData = new FormData();

    Object.entries(input).forEach(([key,value]) => {
        if(value!==undefined) formData.append(key, value);
    });

    try {
        await axiosApi.patch("/posts/"+blogPostId, formData);
    } catch (error:any) {
        throw new Error(error);
    }
}

export async function deleteBlogPost(blogPostId:string) {
    try {
        await axiosApi.delete("/posts/"+blogPostId);
    } catch (error:any) {
        throw new Error(error);
    }
    
    
}

