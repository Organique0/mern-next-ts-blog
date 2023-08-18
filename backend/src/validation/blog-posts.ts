import * as yup from "yup";
import { ObjectIdSchema, imageFileSchema } from "../utils/validation";

export const getBlogPostSchema = yup.object({
    query:yup.object({
        authorId:ObjectIdSchema,
    })
});

export type GetBlogPostQuery = yup.InferType<typeof getBlogPostSchema>["query"];

const blogPostBodySchema = yup.object({
    title: yup.string().required().max(100),
    slug: yup.string().required().max(100).matches(/^[a-zA-Z-9_-]*$/),
    summary: yup.string().required().max(300),
    body: yup.string().required(),
});

export const createBlogpostSchema = yup.object({
    body: blogPostBodySchema,
    file: imageFileSchema.required("Featured image required"),
})

export type BlogPostBody = yup.InferType<typeof blogPostBodySchema>;