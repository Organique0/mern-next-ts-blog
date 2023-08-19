import * as yup from "yup";
import { ObjectIdSchema, imageFileSchema } from "../utils/validation";

export const getBlogPostsSchema = yup.object({
    query:yup.object({
        authorId:ObjectIdSchema,
        page:yup.string(),
    })
});

export type GetBlogPostQuery = yup.InferType<typeof getBlogPostsSchema>["query"];

const blogPostBodySchema = yup.object({
    title: yup.string().required().max(100),
    slug: yup.string().required().max(100).matches(/^[a-zA-Z-9_-]*$/),
    summary: yup.string().required().max(300),
    body: yup.string().required(),
});

export type BlogPostBody = yup.InferType<typeof blogPostBodySchema>;

export const createBlogpostSchema = yup.object({
    body: blogPostBodySchema,
    file: imageFileSchema.required("Featured image required"),
});

export const updateBlogPostSchema = yup.object({
    params:yup.object({
        blogPostId: ObjectIdSchema.required(),
    }),
    body:blogPostBodySchema,
    file:imageFileSchema,
});

export type updateBlogPostParams = yup.InferType<typeof updateBlogPostSchema>["params"];

export const deleteBlogPostSchema = yup.object({
    params:yup.object({
        blogPostId: ObjectIdSchema.required(),
    }),
});

export type deleteBlogPostParams = yup.InferType<typeof deleteBlogPostSchema>["params"];

