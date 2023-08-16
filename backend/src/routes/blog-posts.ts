import express from "express";
import * as BlogPostsController from "../controllers/blog-posts";
import { featuredImageUpload } from "../middleware/image-upload";

const router = express.Router();

router.get("/", BlogPostsController.getBlogPosts);
router.post("/", featuredImageUpload.single("featuredImage") ,BlogPostsController.createBlogPost);
router.get("/post/:slug", BlogPostsController.getBlogPostBySlug)
router.get("/slugs", BlogPostsController.getAllBlogPostSlugs);

export default router;