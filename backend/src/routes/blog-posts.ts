import express from "express";
import * as BlogPostsController from "../controllers/blog-posts";
import { featuredImageUpload } from "../middleware/image-upload";
import requiresAuth from "../middleware/requiresAuth";
import validateRequestSchema from "../middleware/validateRequestSchema";
import { createBlogpostSchema, getBlogPostSchema } from "../validation/blog-posts";

const router = express.Router();

router.get("/", validateRequestSchema(getBlogPostSchema) ,BlogPostsController.getBlogPosts);
router.post("/", requiresAuth , featuredImageUpload.single("featuredImage"), validateRequestSchema(createBlogpostSchema) ,BlogPostsController.createBlogPost);
router.get("/post/:slug", BlogPostsController.getBlogPostBySlug)
router.get("/slugs", BlogPostsController.getAllBlogPostSlugs);

export default router;