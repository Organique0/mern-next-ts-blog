import express from "express";
import * as BlogPostsController from "../controllers/blog-posts";
import { featuredImageUpload } from "../middleware/image-upload";
import requiresAuth from "../middleware/requiresAuth";
import validateRequestSchema from "../middleware/validateRequestSchema";
import { createBlogpostSchema, deleteBlogPostSchema, getBlogPostsSchema, updateBlogPostSchema } from "../validation/blog-posts";

const router = express.Router();

router.get("/", validateRequestSchema(getBlogPostsSchema) ,BlogPostsController.getBlogPosts);
router.post("/", requiresAuth , featuredImageUpload.single("featuredImage"), validateRequestSchema(createBlogpostSchema),BlogPostsController.createBlogPost);
router.get("/post/:slug", BlogPostsController.getBlogPostBySlug)
router.get("/slugs", BlogPostsController.getAllBlogPostSlugs);
router.patch("/:blogPostId", requiresAuth, featuredImageUpload.single("featuredImage"), validateRequestSchema(updateBlogPostSchema), BlogPostsController.updateBlogPost);
router.delete("/:blogPostId", requiresAuth, validateRequestSchema(deleteBlogPostSchema), BlogPostsController.deleteBlogPost);

export default router;