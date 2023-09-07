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
exports.passResetSchema = exports.requestVerificationCodeSchema = exports.updateUserSchema = exports.signUpSchema = exports.passwordSchema = exports.emailSchema = exports.usernameSchema = void 0;
const yup = __importStar(require("yup"));
const validation_1 = require("../utils/validation");
exports.usernameSchema = yup.string().max(20).matches(/^[a-zA-Z0-9_]*$/);
exports.emailSchema = yup.string().email();
exports.passwordSchema = yup.string().matches(/^(?!.* )/).min(6);
exports.signUpSchema = yup.object({
    body: yup.object({
        username: exports.usernameSchema.required(),
        email: exports.emailSchema.required(),
        password: exports.passwordSchema.required(),
        verificationCode: yup.string().required(),
    })
});
exports.updateUserSchema = yup.object({
    body: yup.object({
        username: exports.usernameSchema,
        displayName: yup.string().max(20),
        about: yup.string().max(500),
    }),
    file: validation_1.imageFileSchema,
});
exports.requestVerificationCodeSchema = yup.object({
    body: yup.object({
        email: exports.emailSchema.required(),
    })
});
exports.passResetSchema = yup.object({
    body: yup.object({
        email: exports.emailSchema.required(),
        password: exports.passwordSchema.required(),
        verificationCode: yup.string().required(),
    })
});
