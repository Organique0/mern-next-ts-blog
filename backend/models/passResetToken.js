"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const passResetTokenSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    verificationCode: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: "10m" },
});
exports.default = (0, mongoose_1.model)("passResetToken", passResetTokenSchema);
