import { RequestHandler } from "express";
import blogPostModel from "../models/blog-post";
import assertIsDefined from "../utils/assertIsDefined";
import mongoose from "mongoose";
import sharp from "sharp";
import env from "../env";
import createHttpError from "http-errors";
import { BlogPostBody } from "../validation/blog-posts";

export const getBlogPosts: RequestHandler = async (req,res,next) => {
    try {
        const allBlogPosts = await blogPostModel.find().sort({_id:-1}).populate("author").exec();

        res.status(200).json(allBlogPosts);
    } catch (error) {
        next(error);
    }
};

export const getAllBlogPostSlugs: RequestHandler = async (req,res,next) => {
    try {
        const results = await blogPostModel.find().select("slug").exec();
        const slugs = results.map((post)=>post.slug);
        
        res.status(200).json(slugs);
    } catch (error) {
        next(error);
    }
}


export const getBlogPostBySlug:RequestHandler = async (req,res,next) => {
    try {
        const blogPost = await blogPostModel.findOne({slug:req.params.slug}).populate("author").exec();

        if(!blogPost) {
            throw createHttpError(404, "No blog post found for this slug");
        }

        res.status(200).json(blogPost);
    } catch (error) {
        next(error);
    }
}

export const createBlogPost: RequestHandler<unknown, unknown, BlogPostBody, unknown> = async (req,res,next) => {
    const {slug, title, summary, body} = req.body;
    const featuredImage = req.file;
    const authUser = req.user;
    try {
        assertIsDefined(featuredImage);
        assertIsDefined(authUser);

        const existingSlug = await blogPostModel.findOne({slug}).exec();
        if(existingSlug){
            throw createHttpError(409, "Slug already exists");
        }

        const blogPostId = new mongoose.Types.ObjectId();

        const featuredImageDestinationPath = "/uploads/featured-images/" + blogPostId + ".png";

        await sharp(featuredImage.buffer).resize(700,450).toFile("./" + featuredImageDestinationPath);

        const newPost = await blogPostModel.create({
            _id:blogPostId,
            slug,
            title,
            summary,body,
            featuredImageUrl: env.SERVER_URL + featuredImageDestinationPath,
            author:authUser._id
        });

        res.status(201).json(newPost);
    } catch (error) {
        next(error);
    }
}