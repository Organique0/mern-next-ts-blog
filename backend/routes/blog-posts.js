"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BlogPostsController = __importStar(require("../controllers/blog-posts"));
const image_upload_1 = require("../middleware/image-upload");
const requiresAuth_1 = __importDefault(require("../middleware/requiresAuth"));
const validateRequestSchema_1 = __importDefault(require("../middleware/validateRequestSchema"));
const blog_posts_1 = require("../validation/blog-posts");
const rate_limit_1 = require("../middleware/rate-limit");
const comments_1 = require("../validation/comments");
const router = express_1.default.Router();
router.get("/", (0, validateRequestSchema_1.default)(blog_posts_1.getBlogPostsSchema), BlogPostsController.getBlogPosts);
router.post("/", requiresAuth_1.default, rate_limit_1.createPostRateLimit, image_upload_1.featuredImageUpload.single("featuredImage"), (0, validateRequestSchema_1.default)(blog_posts_1.createBlogpostSchema), BlogPostsController.createBlogPost);
router.get("/post/:slug", BlogPostsController.getBlogPostBySlug);
router.get("/slugs", BlogPostsController.getAllBlogPostSlugs);
router.patch("/:blogPostId", requiresAuth_1.default, rate_limit_1.updatePostRateLimit, image_upload_1.featuredImageUpload.single("featuredImage"), (0, validateRequestSchema_1.default)(blog_posts_1.updateBlogPostSchema), BlogPostsController.updateBlogPost);
router.delete("/:blogPostId", requiresAuth_1.default, (0, validateRequestSchema_1.default)(blog_posts_1.deleteBlogPostSchema), BlogPostsController.deleteBlogPost);
router.post("/images", requiresAuth_1.default, rate_limit_1.uploadImageRateLimit, image_upload_1.inPostImageUpload.single("inPostImage"), (0, validateRequestSchema_1.default)(blog_posts_1.uploadInPostImageSchema), BlogPostsController.uploadInPostImage);
router.get("/:blogPostId/comments", (0, validateRequestSchema_1.default)(comments_1.getCommentsSchema), BlogPostsController.getCommentsForBlogPost);
router.post("/:blogPostId/comments", requiresAuth_1.default, (0, validateRequestSchema_1.default)(comments_1.createCommentSchema), BlogPostsController.createComment);
router.get("/comments/:commentId/replies", (0, validateRequestSchema_1.default)(comments_1.getCommentRepliesSchema), BlogPostsController.getCommentReplies);
router.patch("/comments/:commentId", requiresAuth_1.default, (0, validateRequestSchema_1.default)(comments_1.updateCommentSchema), BlogPostsController.updateComment);
router.delete("/comments/:commentId", requiresAuth_1.default, (0, validateRequestSchema_1.default)(comments_1.DeleteCommentSchema), BlogPostsController.deleteComment);
exports.default = router;
