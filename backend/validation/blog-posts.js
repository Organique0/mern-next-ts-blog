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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadInPostImageSchema = exports.deleteBlogPostSchema = exports.updateBlogPostSchema = exports.createBlogpostSchema = exports.getBlogPostsSchema = void 0;
const yup = __importStar(require("yup"));
const validation_1 = require("../utils/validation");
exports.getBlogPostsSchema = yup.object({
    query: yup.object({
        authorId: validation_1.ObjectIdSchema,
        page: yup.string(),
    })
});
const blogPostBodySchema = yup.object({
    title: yup.string().required().max(100),
    slug: yup.string().required().max(100).matches(/^[a-zA-Z-9_-]*$/),
    summary: yup.string().required().max(300),
    body: yup.string().required(),
});
exports.createBlogpostSchema = yup.object({
    body: blogPostBodySchema,
    file: validation_1.imageFileSchema.required("Featured image required"),
});
exports.updateBlogPostSchema = yup.object({
    params: yup.object({
        blogPostId: validation_1.ObjectIdSchema.required(),
    }),
    body: blogPostBodySchema,
    file: validation_1.imageFileSchema,
});
exports.deleteBlogPostSchema = yup.object({
    params: yup.object({
        blogPostId: validation_1.ObjectIdSchema.required(),
    }),
});
exports.uploadInPostImageSchema = yup.object({
    file: validation_1.imageFileSchema.required("image is required"),
});
