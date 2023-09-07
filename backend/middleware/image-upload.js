"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inPostImageUpload = exports.profileImageUpload = exports.featuredImageUpload = void 0;
const multer_1 = __importDefault(require("multer"));
exports.featuredImageUpload = (0, multer_1.default)({
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter(req, file, callback) {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
            callback(null, true);
        }
        else {
            callback(new Error("Unsupported image format"));
        }
    }
});
exports.profileImageUpload = (0, multer_1.default)({
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter(req, file, callback) {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
            callback(null, true);
        }
        else {
            callback(new Error("Unsupported image format"));
        }
    }
});
exports.inPostImageUpload = (0, multer_1.default)({
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter(req, file, callback) {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
            callback(null, true);
        }
        else {
            callback(new Error("Unsupported image format"));
        }
    }
});
