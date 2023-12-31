import { RequestHandler } from "express";
import blogPostModel from "../models/blog-post";
import CommentModel from "../models/comment";
import assertIsDefined from "../utils/assertIsDefined";
import mongoose from "mongoose";
import sharp from "sharp";
import env from "../env";
import createHttpError from "http-errors";
import { BlogPostBody, GetBlogPostQuery, deleteBlogPostParams, updateBlogPostParams } from "../validation/blog-posts";
import axios from "axios";
import crypto from "crypto";
import { extname } from 'path';
import { PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { DeleteCommentParams, GetCommentRepliesParams, GetCommentRepliesQuery, UpdateCommentBody, UpdateCommentParams, createCommentBody, createCommentParams, getCommentsParams, getCommentsQuery } from "../validation/comments";
import s3Client from "../utils/s3";

export const getBlogPosts: RequestHandler<unknown, unknown, unknown, GetBlogPostQuery> = async (req, res, next) => {
    const authorId = req.query.authorId;
    const page = parseInt(req.query.page || "1");
    const pageSize = 8;

    const filter = authorId ? { author: authorId } : {};

    try {
        const getBlogPostsQuery = blogPostModel.find(filter).sort({ _id: -1 }).skip((page - 1) * pageSize).limit(pageSize).populate("author").exec();

        const countDocumentsQuery = blogPostModel.countDocuments(filter).exec();

        const [blogPosts, totalResults] = await Promise.all([getBlogPostsQuery, countDocumentsQuery]);

        const totalPages = Math.ceil(totalResults / pageSize);

        res.status(200).json({
            blogPosts,
            page,
            totalPages,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllBlogPostSlugs: RequestHandler = async (req, res, next) => {
    try {
        const results = await blogPostModel.find().select("slug").exec();
        const slugs = results.map((post) => post.slug);

        res.status(200).json(slugs);
    } catch (error) {
        next(error);
    }
}


export const getBlogPostBySlug: RequestHandler = async (req, res, next) => {
    try {
        const blogPost = await blogPostModel.findOne({ slug: req.params.slug }).populate("author").exec();

        if (!blogPost) {
            throw createHttpError(404, "No blog post found for this slug");
        }

        res.status(200).json(blogPost);
    } catch (error) {
        next(error);
    }
}

export const createBlogPost: RequestHandler<unknown, unknown, BlogPostBody, unknown> = async (req, res, next) => {
    const { slug, title, summary, body } = req.body;
    const featuredImage = req.file;
    const authUser = req.user;
    try {
        assertIsDefined(featuredImage);
        assertIsDefined(authUser);

        const existingSlug = await blogPostModel.findOne({ slug }).exec();
        if (existingSlug) {
            throw createHttpError(409, "Slug already exists");
        }

        const blogPostId = new mongoose.Types.ObjectId();


        const processedImageBuffer = await sharp(featuredImage.buffer)
            .resize(700, 450).jpeg().toBuffer();

        const originalFileExtension = extname(featuredImage.originalname);

        try {
            await s3Client.send(new HeadObjectCommand({
                Bucket: 'mern-next-ts-blog',
                Key: blogPostId.toString() + originalFileExtension,
            }));
            await s3Client.send(new DeleteObjectCommand({
                Bucket: "mern-next-ts-blog",
                Key: blogPostId.toString() + originalFileExtension,
            }));
            await s3Client.send(
                new PutObjectCommand({
                    Bucket: 'mern-next-ts-blog',
                    Key: blogPostId.toString() + originalFileExtension,
                    Body: processedImageBuffer,
                    ACL: 'public-read',
                })
            );
        } catch (error: any) {
            if (error.$metadata.httpStatusCode === 404) {
                await s3Client.send(
                    new PutObjectCommand({
                        Bucket: 'mern-next-ts-blog',
                        Key: blogPostId.toString() + originalFileExtension,
                        Body: processedImageBuffer,
                        ACL: 'public-read',
                    })
                );
            }
        }


        const newPost = await blogPostModel.create({
            _id: blogPostId,
            slug,
            title,
            summary, body,
            featuredImageUrl: `https://mern-next-ts-blog.s3.eu-north-1.amazonaws.com/${blogPostId.toString()}${originalFileExtension}`,
            author: authUser._id
        });

        res.status(201).json(newPost);
    } catch (error) {
        next(error);
    }
}

export const updateBlogPost: RequestHandler<updateBlogPostParams, unknown, BlogPostBody, unknown> = async (req, res, next) => {
    const { blogPostId } = req.params;
    const { slug, title, summary, body } = req.body;
    const featuredImage = req.file;
    const authenticatedUser = req.user;

    try {
        assertIsDefined(authenticatedUser);



        const existingSlug = await blogPostModel.findOne({ slug }).exec();

        if (existingSlug && !existingSlug._id.equals(blogPostId)) {
            throw createHttpError(409, "Slug already exists");
        }

        const postToEdit = await blogPostModel.findById(blogPostId).exec();

        if (!postToEdit) throw createHttpError(404);

        if (!postToEdit.author.equals(authenticatedUser._id)) {
            throw createHttpError(401);
        }

        postToEdit.slug = slug;
        postToEdit.title = title;
        postToEdit.summary = summary;
        postToEdit.body = body;

        /* if (featuredImage) {
            const featuredImageDestinationPath = "/uploads/featured-images/" + blogPostId + ".png";
            await sharp(featuredImage.buffer).resize(700, 450).toFile("./" + featuredImageDestinationPath);
            postToEdit.featuredImageUrl = env.SERVER_URL + featuredImageDestinationPath + "?lastupdated=" + Date.now();
        } */

        if (featuredImage) {
            const processedImageBuffer = await sharp(featuredImage.buffer)
                .resize(700, 450).jpeg().toBuffer();
            const originalFileExtension = extname(featuredImage.originalname);

            await s3Client.send(
                new PutObjectCommand({
                    Bucket: "mern-next-ts-blog",
                    Key: blogPostId.toString() + originalFileExtension,
                    Body: processedImageBuffer,
                    ACL: "public-read"
                })
            );
            postToEdit.featuredImageUrl = `https://mern-next-ts-blog.s3.eu-north-1.amazonaws.com/${blogPostId.toString()}${originalFileExtension}`;
        }

        await postToEdit.save();

        await axios.get(env.FRONTEND_URL + `/api/revalidate-post/${slug}?secret=${env.POST_REVALIDATION_KEY}`);

        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};

export const deleteBlogPost: RequestHandler<deleteBlogPostParams, unknown, unknown, unknown> = async (req, res, next) => {
    const { blogPostId } = req.params;
    const authenticatedUser = req.user;

    try {
        assertIsDefined(authenticatedUser);

        const postToDelete = await blogPostModel.findById(blogPostId).exec();

        if (!postToDelete) throw createHttpError(404);

        if (!postToDelete.author.equals(authenticatedUser._id)) {
            throw createHttpError(401);
        }

        const originalFileExtension = extname(postToDelete.featuredImageUrl);

        await s3Client.send(new DeleteObjectCommand({
            Bucket: "mern-next-ts-blog",
            Key: blogPostId.toString() + originalFileExtension,
        }));

        /*         if (postToDelete.featuredImageUrl.startsWith(env.SERVER_URL)) {
                    const imagePath = postToDelete.featuredImageUrl.split(env.SERVER_URL)[1].split("?")[0];
                    fs.unlinkSync("." + imagePath);
                } */

        await postToDelete.deleteOne();
        //because we are using getStaticProps we need to make a request to the frontend to update posts after deletion or update
        await axios.get(env.FRONTEND_URL + `/api/revalidate-post/${postToDelete.slug}?secret=${env.POST_REVALIDATION_KEY}`);

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}

export const uploadInPostImage: RequestHandler = async (req, res, next) => {
    const image = req.file;
    try {
        assertIsDefined(image);

        const fileName = crypto.randomBytes(20).toString("hex");

        const processedImageBuffer = await sharp(image.buffer)
            .resize(700, 450).jpeg().toBuffer();
        const originalFileExtension = extname(image.originalname);
        // Upload the image to S3
        await s3Client.send(
            new PutObjectCommand({
                Bucket: "mern-next-ts-blog",
                Key: fileName + originalFileExtension,
                Body: processedImageBuffer,
                ACL: "public-read"
            })
        );
        const imageUrl = `https://mern-next-ts-blog.s3.eu-north-1.amazonaws.com/${fileName}${originalFileExtension}`;
        res.status(201).json({ imageUrl: imageUrl });

    } catch (error) {
        next(error);
    }
}

export const getCommentsForBlogPost: RequestHandler<getCommentsParams, unknown, unknown, getCommentsQuery> = async (req, res, next) => {
    const { blogPostId } = req.params;
    const { continueAfterId } = req.query;

    //number of comments loaded on each request
    const pageSize = 3;

    try {
        const query = CommentModel.find({ blogPostId, parentCommentId: undefined }).sort({ _id: -1 });

        if (continueAfterId) {
            query.lt("_id", continueAfterId);
        }

        const result = await query.limit(pageSize + 1).populate("author").exec();

        const comments = result.slice(0, pageSize);
        const endOfPaginationReach = result.length <= pageSize;

        //append number of replies for each comment to show later
        const commentsWithReplieCounts = await Promise.all(comments.map(async comment => {
            const repliesCount = await CommentModel.countDocuments({ parentCommentId: comment._id });
            return { ...comment.toObject(), repliesCount }
        }));

        res.status(200).json({
            comments: commentsWithReplieCounts,
            endOfPaginationReach,
        })
    } catch (error) {
        next(error);
    }
}

export const getCommentReplies: RequestHandler<GetCommentRepliesParams, unknown, unknown, GetCommentRepliesQuery> = async (req, res, next) => {
    const { commentId: parentCommentId } = req.params;
    const { continueAfterId } = req.query;

    //number of replies returned
    const pageSize = 3;

    try {
        const query = CommentModel.find({ parentCommentId });

        if (continueAfterId) {
            query.gt("_id", continueAfterId);
        }

        const result = await query.limit(pageSize + 1).populate("author").exec();

        const comments = result.slice(0, pageSize);
        const endOfPaginationReach = result.length <= pageSize;

        res.status(200).json({
            comments,
            endOfPaginationReach,
        });
    } catch (error) {
        next(error);
    }
}

export const updateComment: RequestHandler<UpdateCommentParams, unknown, UpdateCommentBody, unknown> = async (req, res, next) => {
    const { commentId } = req.params;
    const { newText } = req.body;
    const authenticatedUser = req.user;

    try {
        assertIsDefined(authenticatedUser);

        const commentToUpdate = await CommentModel.findById(commentId).populate("author").exec();

        if (!commentToUpdate) throw createHttpError(404);

        if (!commentToUpdate.author.equals(authenticatedUser._id)) throw createHttpError(401);

        commentToUpdate.text = newText;

        await commentToUpdate.save();

        res.status(200).json(commentToUpdate);
    } catch (error) {
        next(error);
    }
}

export const deleteComment: RequestHandler<DeleteCommentParams, unknown, unknown, unknown> = async (req, res, next) => {
    const { commentId } = req.params;
    const authenticatedUser = req.user;

    try {
        assertIsDefined(authenticatedUser);

        const commentToDelete = await CommentModel.findById(commentId).exec();

        if (!commentToDelete) throw createHttpError(404);

        if (!commentToDelete.author.equals(authenticatedUser._id)) throw createHttpError(401);

        await commentToDelete.deleteOne();

        await CommentModel.deleteMany({ parentCommentId: commentId }).exec();

        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}

export const createComment: RequestHandler<createCommentParams, unknown, createCommentBody, unknown> = async (req, res, next) => {
    const { blogPostId } = req.params;
    const { text, parentCommentId } = req.body;
    const authenticatedUser = req.user;

    try {
        assertIsDefined(authenticatedUser);

        const newComment = await CommentModel.create({
            blogPostId,
            text,
            author: authenticatedUser,
            parentCommentId,
        });

        await CommentModel.populate(newComment, { path: "author" });

        res.status(201).json(newComment);
    } catch (error) {
        next(error);
    }
}