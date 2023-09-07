"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComment = exports.deleteComment = exports.updateComment = exports.getCommentReplies = exports.getCommentsForBlogPost = exports.uploadInPostImage = exports.deleteBlogPost = exports.updateBlogPost = exports.createBlogPost = exports.getBlogPostBySlug = exports.getAllBlogPostSlugs = exports.getBlogPosts = void 0;
const blog_post_1 = __importDefault(require("../models/blog-post"));
const comment_1 = __importDefault(require("../models/comment"));
const assertIsDefined_1 = __importDefault(require("../utils/assertIsDefined"));
const mongoose_1 = __importDefault(require("mongoose"));
const sharp_1 = __importDefault(require("sharp"));
const env_1 = __importDefault(require("../env"));
const http_errors_1 = __importDefault(require("http-errors"));
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const path_1 = __importDefault(require("path"));
const getBlogPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authorId = req.query.authorId;
    const page = parseInt(req.query.page || "1");
    const pageSize = 8;
    const filter = authorId ? { author: authorId } : {};
    try {
        const getBlogPostsQuery = blog_post_1.default.find(filter).sort({ _id: -1 }).skip((page - 1) * pageSize).limit(pageSize).populate("author").exec();
        const countDocumentsQuery = blog_post_1.default.countDocuments(filter).exec();
        const [blogPosts, totalResults] = yield Promise.all([getBlogPostsQuery, countDocumentsQuery]);
        const totalPages = Math.ceil(totalResults / pageSize);
        res.status(200).json({
            blogPosts,
            page,
            totalPages,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getBlogPosts = getBlogPosts;
const getAllBlogPostSlugs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield blog_post_1.default.find().select("slug").exec();
        const slugs = results.map((post) => post.slug);
        res.status(200).json(slugs);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllBlogPostSlugs = getAllBlogPostSlugs;
const getBlogPostBySlug = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogPost = yield blog_post_1.default.findOne({ slug: req.params.slug }).populate("author").exec();
        if (!blogPost) {
            throw (0, http_errors_1.default)(404, "No blog post found for this slug");
        }
        res.status(200).json(blogPost);
    }
    catch (error) {
        next(error);
    }
});
exports.getBlogPostBySlug = getBlogPostBySlug;
const createBlogPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug, title, summary, body } = req.body;
    const featuredImage = req.file;
    const authUser = req.user;
    try {
        (0, assertIsDefined_1.default)(featuredImage);
        (0, assertIsDefined_1.default)(authUser);
        const existingSlug = yield blog_post_1.default.findOne({ slug }).exec();
        if (existingSlug) {
            throw (0, http_errors_1.default)(409, "Slug already exists");
        }
        const blogPostId = new mongoose_1.default.Types.ObjectId();
        const featuredImageDestinationPath = "/uploads/featured-images/" + blogPostId + ".png";
        yield (0, sharp_1.default)(featuredImage.buffer).resize(700, 450).toFile("./" + featuredImageDestinationPath);
        const newPost = yield blog_post_1.default.create({
            _id: blogPostId,
            slug,
            title,
            summary, body,
            featuredImageUrl: env_1.default.SERVER_URL + featuredImageDestinationPath,
            author: authUser._id
        });
        res.status(201).json(newPost);
    }
    catch (error) {
        next(error);
    }
});
exports.createBlogPost = createBlogPost;
const updateBlogPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogPostId } = req.params;
    const { slug, title, summary, body } = req.body;
    const featuredImage = req.file;
    const authenticatedUser = req.user;
    try {
        (0, assertIsDefined_1.default)(authenticatedUser);
        const existingSlug = yield blog_post_1.default.findOne({ slug }).exec();
        if (existingSlug && !existingSlug._id.equals(blogPostId)) {
            throw (0, http_errors_1.default)(409, "Slug already exists");
        }
        const postToEdit = yield blog_post_1.default.findById(blogPostId).exec();
        if (!postToEdit)
            throw (0, http_errors_1.default)(404);
        if (!postToEdit.author.equals(authenticatedUser._id)) {
            throw (0, http_errors_1.default)(401);
        }
        postToEdit.slug = slug;
        postToEdit.title = title;
        postToEdit.summary = summary;
        postToEdit.body = body;
        if (featuredImage) {
            const featuredImageDestinationPath = "/uploads/featured-images/" + blogPostId + ".png";
            yield (0, sharp_1.default)(featuredImage.buffer).resize(700, 450).toFile("./" + featuredImageDestinationPath);
            postToEdit.featuredImageUrl = env_1.default.SERVER_URL + featuredImageDestinationPath + "?lastupdated=" + Date.now();
        }
        yield postToEdit.save();
        yield axios_1.default.get(env_1.default.FRONTEND_URL + `/api/revalidate-post/${slug}?secret=${env_1.default.POST_REVALIDATION_KEY}`);
        res.sendStatus(200);
    }
    catch (error) {
        next(error);
    }
});
exports.updateBlogPost = updateBlogPost;
const deleteBlogPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogPostId } = req.params;
    const authenticatedUser = req.user;
    try {
        (0, assertIsDefined_1.default)(authenticatedUser);
        const postToDelete = yield blog_post_1.default.findById(blogPostId).exec();
        if (!postToDelete)
            throw (0, http_errors_1.default)(404);
        if (!postToDelete.author.equals(authenticatedUser._id)) {
            throw (0, http_errors_1.default)(401);
        }
        if (postToDelete.featuredImageUrl.startsWith(env_1.default.SERVER_URL)) {
            const imagePath = postToDelete.featuredImageUrl.split(env_1.default.SERVER_URL)[1].split("?")[0];
            fs_1.default.unlinkSync("." + imagePath);
        }
        yield postToDelete.deleteOne();
        //because we are using getStaticProps we need to make a request to the frontend to update posts after deletion or update
        yield axios_1.default.get(env_1.default.FRONTEND_URL + `/api/revalidate-post/${postToDelete.slug}?secret=${env_1.default.POST_REVALIDATION_KEY}`);
        res.sendStatus(204);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteBlogPost = deleteBlogPost;
const uploadInPostImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const image = req.file;
    try {
        (0, assertIsDefined_1.default)(image);
        const fileName = crypto_1.default.randomBytes(20).toString("hex");
        const imageDestinationPath = "/uploads/in-post-images/" + fileName + path_1.default.extname(image.originalname);
        yield (0, sharp_1.default)(image.buffer).resize(1920, undefined, { withoutEnlargement: true }).toFile("./" + imageDestinationPath);
        res.status(201).json({ imageUrl: env_1.default.SERVER_URL + imageDestinationPath });
    }
    catch (error) {
        next(error);
    }
});
exports.uploadInPostImage = uploadInPostImage;
const getCommentsForBlogPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogPostId } = req.params;
    const { continueAfterId } = req.query;
    //number of comments loaded on each request
    const pageSize = 3;
    try {
        const query = comment_1.default.find({ blogPostId, parentCommentId: undefined }).sort({ _id: -1 });
        if (continueAfterId) {
            query.lt("_id", continueAfterId);
        }
        const result = yield query.limit(pageSize + 1).populate("author").exec();
        const comments = result.slice(0, pageSize);
        const endOfPaginationReach = result.length <= pageSize;
        //append number of replies for each comment to show later
        const commentsWithReplieCounts = yield Promise.all(comments.map((comment) => __awaiter(void 0, void 0, void 0, function* () {
            const repliesCount = yield comment_1.default.countDocuments({ parentCommentId: comment._id });
            return Object.assign(Object.assign({}, comment.toObject()), { repliesCount });
        })));
        res.status(200).json({
            comments: commentsWithReplieCounts,
            endOfPaginationReach,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getCommentsForBlogPost = getCommentsForBlogPost;
const getCommentReplies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId: parentCommentId } = req.params;
    const { continueAfterId } = req.query;
    //number of replies returned
    const pageSize = 3;
    try {
        const query = comment_1.default.find({ parentCommentId });
        if (continueAfterId) {
            query.gt("_id", continueAfterId);
        }
        const result = yield query.limit(pageSize + 1).populate("author").exec();
        const comments = result.slice(0, pageSize);
        const endOfPaginationReach = result.length <= pageSize;
        res.status(200).json({
            comments,
            endOfPaginationReach,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getCommentReplies = getCommentReplies;
const updateComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    const { newText } = req.body;
    const authenticatedUser = req.user;
    try {
        (0, assertIsDefined_1.default)(authenticatedUser);
        const commentToUpdate = yield comment_1.default.findById(commentId).populate("author").exec();
        if (!commentToUpdate)
            throw (0, http_errors_1.default)(404);
        if (!commentToUpdate.author.equals(authenticatedUser._id))
            throw (0, http_errors_1.default)(401);
        commentToUpdate.text = newText;
        yield commentToUpdate.save();
        res.status(200).json(commentToUpdate);
    }
    catch (error) {
        next(error);
    }
});
exports.updateComment = updateComment;
const deleteComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    const authenticatedUser = req.user;
    try {
        (0, assertIsDefined_1.default)(authenticatedUser);
        const commentToDelete = yield comment_1.default.findById(commentId).exec();
        if (!commentToDelete)
            throw (0, http_errors_1.default)(404);
        if (!commentToDelete.author.equals(authenticatedUser._id))
            throw (0, http_errors_1.default)(401);
        yield commentToDelete.deleteOne();
        yield comment_1.default.deleteMany({ parentCommentId: commentId }).exec();
        res.sendStatus(200);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteComment = deleteComment;
const createComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogPostId } = req.params;
    const { text, parentCommentId } = req.body;
    const authenticatedUser = req.user;
    try {
        (0, assertIsDefined_1.default)(authenticatedUser);
        const newComment = yield comment_1.default.create({
            blogPostId,
            text,
            author: authenticatedUser,
            parentCommentId,
        });
        yield comment_1.default.populate(newComment, { path: "author" });
        res.status(201).json(newComment);
    }
    catch (error) {
        next(error);
    }
});
exports.createComment = createComment;
