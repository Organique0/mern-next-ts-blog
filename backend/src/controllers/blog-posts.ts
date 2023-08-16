import { RequestHandler } from "express";
import blogPostModel from "../models/blog-post";

export const getBlogPosts: RequestHandler = async (req,res) => {
    try {
        const allBlogPosts = await blogPostModel.find().sort({_id:-1}).exec();

        res.status(200).json(allBlogPosts);
    } catch (error) {
        res.status(500).json({ error });
    }
};

interface BlogPostBody {
    slug: string;
    title: string;
    summary: string;
    body: string;
}

export const createBlogPost: RequestHandler<unknown, unknown, BlogPostBody, unknown> = async (req,res) => {
    const {slug, title, summary, body} = req.body;
    try {
        const newPost = await blogPostModel.create({
            slug,title,summary,body
        });

        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
}