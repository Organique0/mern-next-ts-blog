"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const requiresAuth = (req, res, next) => {
    if (req.user) {
        next();
    }
    else {
        next((0, http_errors_1.default)(401, "User not authenticated"));
    }
};
exports.default = requiresAuth;
