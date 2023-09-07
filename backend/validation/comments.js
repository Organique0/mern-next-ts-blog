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
exports.DeleteCommentSchema = exports.updateCommentSchema = exports.getCommentRepliesSchema = exports.createCommentSchema = exports.getCommentsSchema = void 0;
const yup = __importStar(require("yup"));
const validation_1 = require("../utils/validation");
const commentTextSchema = yup.string().required().max(500);
exports.getCommentsSchema = yup.object({
    params: yup.object({
        blogPostId: validation_1.ObjectIdSchema.required(),
    }),
    query: yup.object({
        continueAfterId: validation_1.ObjectIdSchema,
    })
});
exports.createCommentSchema = yup.object({
    body: yup.object({
        text: commentTextSchema,
        parentCommentId: validation_1.ObjectIdSchema,
    }),
    params: yup.object({
        blogPostId: validation_1.ObjectIdSchema.required(),
    }),
});
exports.getCommentRepliesSchema = yup.object({
    params: yup.object({
        commentId: validation_1.ObjectIdSchema.required(),
    }),
    query: yup.object({
        continueAfterId: validation_1.ObjectIdSchema,
    }),
});
exports.updateCommentSchema = yup.object({
    body: yup.object({
        newText: commentTextSchema,
    }),
    params: yup.object({
        commentId: validation_1.ObjectIdSchema.required(),
    })
});
exports.DeleteCommentSchema = yup.object({
    params: yup.object({
        commentId: validation_1.ObjectIdSchema.required(),
    }),
});
