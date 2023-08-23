import * as yup from "yup";
import { ObjectIdSchema } from "../utils/validation";

const commentTextSchema = yup.string().required().max(500);

export const getCommentsSchema = yup.object({
    params: yup.object({
        blogPostId: ObjectIdSchema.required(),
    }),
    query: yup.object({
        continueAfterId: ObjectIdSchema,
    })
});

export type getCommentsParams = yup.InferType<typeof getCommentsSchema>["params"];
export type getCommentsQuery = yup.InferType<typeof getCommentsSchema>["query"];

export const createCommentSchema = yup.object({
    body: yup.object({
        text: commentTextSchema,
        parentCommentId: ObjectIdSchema,
    }),
    params: yup.object({
        blogPostId: ObjectIdSchema.required(),
    }),
});

export type createCommentParams = yup.InferType<typeof createCommentSchema>["params"];
export type createCommentBody = yup.InferType<typeof createCommentSchema>["body"];

export const getCommentRepliesSchema = yup.object({
    params: yup.object({
        commentId: ObjectIdSchema.required(),
    }),
    query: yup.object({
        continueAfterId: ObjectIdSchema,
    }),
});

export type GetCommentRepliesParams = yup.InferType<typeof getCommentRepliesSchema>["params"];
export type GetCommentRepliesQuery = yup.InferType<typeof getCommentRepliesSchema>["query"];

export const updateCommentSchema = yup.object({
    body: yup.object({
        newText: commentTextSchema,
    }),
    params: yup.object({
        commentId: ObjectIdSchema.required(),
    })
})

export type UpdateCommentParams = yup.InferType<typeof updateCommentSchema>["params"];
export type UpdateCommentBody = yup.InferType<typeof updateCommentSchema>["body"];

export const DeleteCommentSchema = yup.object({
    params: yup.object({
        commentId: ObjectIdSchema.required(),
    }),
});

export type DeleteCommentParams = yup.InferType<typeof DeleteCommentSchema>["params"];