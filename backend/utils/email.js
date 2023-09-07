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
exports.sendPassResetCode = exports.sendVerificationCode = void 0;
const nodemailer_1 = require("nodemailer");
const env_1 = __importDefault(require("../env"));
const transporter = (0, nodemailer_1.createTransport)({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: "grabnar.luka@gmail.com",
        pass: env_1.default.SMTP_PASSWORD,
    },
});
function sendVerificationCode(toEmail, verificationCode) {
    return __awaiter(this, void 0, void 0, function* () {
        yield transporter.sendMail({
            from: "noreply@blogApp.com",
            to: toEmail,
            subject: "Your verification code for Blog App",
            html: `<p>This verification code will expire in 10 minutes</p><strong>${verificationCode}</strong>`
        });
    });
}
exports.sendVerificationCode = sendVerificationCode;
function sendPassResetCode(toEmail, verificationCode) {
    return __awaiter(this, void 0, void 0, function* () {
        yield transporter.sendMail({
            from: "noreply@blogApp.com",
            to: toEmail,
            subject: "Your password reset code for Blog App",
            html: `
        <p>A password reset request has been send for this account. Use this code to reset your password. It will expire in 10 minutes.</p>
        <p><strong>${verificationCode}</strong></p>
        If you did not request a password reset, ignore this email.
        `
        });
    });
}
exports.sendPassResetCode = sendPassResetCode;
