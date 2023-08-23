import express from "express";
import * as BlogPostsController from "../controllers/blog-posts";
import { featuredImageUpload, inPostImageUpload } from "../middleware/image-upload";
import requiresAuth from "../middleware/requiresAuth";
import validateRequestSchema from "../middleware/validateRequestSchema";
import { createBlogpostSchema, deleteBlogPostSchema, getBlogPostsSchema, updateBlogPostSchema, uploadInPostImageSchema } from "../validation/blog-posts";
import { createPostRateLimit, updatePostRateLimit, uploadImageRateLimit } from "../middleware/rate-limit";
import { DeleteCommentSchema, createCommentSchema, getCommentRepliesSchema, getCommentsSchema, updateCommentSchema } from "../validation/comments";

const router = express.Router();

router.get("/", validateRequestSchema(getBlogPostsSchema), BlogPostsController.getBlogPosts);
router.post("/", requiresAuth, createPostRateLimit, featuredImageUpload.single("featuredImage"), validateRequestSchema(createBlogpostSchema), BlogPostsController.createBlogPost);
router.get("/post/:slug", BlogPostsController.getBlogPostBySlug)
router.get("/slugs", BlogPostsController.getAllBlogPostSlugs);
router.patch("/:blogPostId", requiresAuth, updatePostRateLimit, featuredImageUpload.single("featuredImage"), validateRequestSchema(updateBlogPostSchema), BlogPostsController.updateBlogPost);
router.delete("/:blogPostId", requiresAuth, validateRequestSchema(deleteBlogPostSchema), BlogPostsController.deleteBlogPost);
router.post("/images", requiresAuth, uploadImageRateLimit, inPostImageUpload.single("inPostImage"), validateRequestSchema(uploadInPostImageSchema), BlogPostsController.uploadInPostImage);

router.get("/:blogPostId/comments", validateRequestSchema(getCommentsSchema), BlogPostsController.getCommentsForBlogPost);
router.post("/:blogPostId/comments", requiresAuth, validateRequestSchema(createCommentSchema), BlogPostsController.createComment);

router.get("/comments/:commentId/replies", validateRequestSchema(getCommentRepliesSchema), BlogPostsController.getCommentReplies);
router.patch("/comments/:commentId", requiresAuth, validateRequestSchema(updateCommentSchema), BlogPostsController.updateComment);
router.delete("/comments/:commentId", requiresAuth, validateRequestSchema(DeleteCommentSchema), BlogPostsController.deleteComment);

export default router;