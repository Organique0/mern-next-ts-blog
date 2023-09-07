"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true, select: false },
    displayName: { type: String },
    about: { type: String },
    profilePicUrl: { type: String },
    password: { type: String, select: false },
    googleId: { type: String, unique: true, sparse: true, select: false },
    githubId: { type: String, unique: true, sparse: true, select: false },
}, { timestamps: true });
userSchema.pre("validate", function (next) {
    if (!this.email && !this.googleId && !this.githubId) {
        return next(new Error("User must have an email or social id"));
    }
    next();
});
exports.default = (0, mongoose_1.model)("User", userSchema);
