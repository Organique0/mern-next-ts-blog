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
exports.updateUser = exports.logOut = exports.getAuthenticatedUser = exports.signUp = exports.requestVerificationCode = exports.resetPassword = exports.requestPasswordResetCode = exports.getUserByUsername = void 0;
const user_1 = __importDefault(require("../models/user"));
const http_errors_1 = __importDefault(require("http-errors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const assertIsDefined_1 = __importDefault(require("../utils/assertIsDefined"));
const sharp_1 = __importDefault(require("sharp"));
const env_1 = __importDefault(require("../env"));
const crypto_1 = __importDefault(require("crypto"));
const email_ver_token_1 = __importDefault(require("../models/email-ver-token"));
const Email = __importStar(require("../utils/email"));
const passResetToken_1 = __importDefault(require("../models/passResetToken"));
const auth_1 = require("../utils/auth");
const getUserByUsername = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({ username: req.params.username }).exec();
        if (!user)
            throw (0, http_errors_1.default)(404, "User not found");
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserByUsername = getUserByUsername;
const requestPasswordResetCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield user_1.default.findOne({ email }).collation({ locale: "en", strength: 2 }).exec();
        if (!user) {
            throw (0, http_errors_1.default)(404, "A user with this email does not exist");
        }
        const verificationCode = crypto_1.default.randomInt(100000, 999999).toString();
        yield passResetToken_1.default.create({ email, verificationCode });
        yield Email.sendPassResetCode(email, verificationCode);
        res.sendStatus(200);
    }
    catch (error) {
        next(error);
    }
});
exports.requestPasswordResetCode = requestPasswordResetCode;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password: newPasswordRaw, verificationCode } = req.body;
    try {
        const existingUser = yield user_1.default.findOne({ email }).select("+email").collation({ locale: "en", strength: 2 }).exec();
        if (!existingUser) {
            throw (0, http_errors_1.default)(404, "User not found");
        }
        const passwordResetToken = yield passResetToken_1.default.findOne({ email, verificationCode }).exec();
        if (!passwordResetToken) {
            throw (0, http_errors_1.default)(400, "verification code incorrect or expired");
        }
        else {
            yield passwordResetToken.deleteOne();
        }
        yield (0, auth_1.destroyAllActiveSessionsForUser)(existingUser._id.toString());
        const newPasswordHashed = yield bcrypt_1.default.hash(newPasswordRaw, 10);
        existingUser.password = newPasswordHashed;
        yield existingUser.save();
        const user = existingUser.toObject();
        delete user.password;
        req.logIn(user, error => {
            if (error)
                throw error;
            res.status(200).json(user);
        });
    }
    catch (error) {
        next(error);
    }
});
exports.resetPassword = resetPassword;
const requestVerificationCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const existingEmail = yield user_1.default.findOne({ email }).collation({ locale: "en", strength: 2 }).exec();
        if (existingEmail) {
            throw (0, http_errors_1.default)(409, "A user with this email address already exists. Please log in instead.");
        }
        const verificationCode = crypto_1.default.randomInt(100000, 999999).toString();
        yield email_ver_token_1.default.create({ email, verificationCode });
        yield Email.sendVerificationCode(email, verificationCode);
        res.sendStatus(200);
    }
    catch (error) {
        next(error);
    }
});
exports.requestVerificationCode = requestVerificationCode;
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, verificationCode } = req.body;
    try {
        const existingUsername = yield user_1.default.findOne({ username }).collation({ locale: "en", strength: 2 }).exec();
        if (existingUsername) {
            throw (0, http_errors_1.default)(409, "username taken");
        }
        const emailVerToken = yield email_ver_token_1.default.findOne({ email, verificationCode }).exec();
        if (!emailVerToken) {
            throw (0, http_errors_1.default)(400, "verification code incorrect or expired");
        }
        else {
            yield emailVerToken.deleteOne();
        }
        const passwordHashed = yield bcrypt_1.default.hash(password, 10);
        const result = yield user_1.default.create({
            username,
            displayName: username,
            email,
            password: passwordHashed,
        });
        const newUser = result.toObject();
        delete newUser.password;
        req.logIn(newUser, error => {
            if (error)
                throw error;
            res.status(201).json(newUser);
        });
    }
    catch (error) {
        next(error);
    }
});
exports.signUp = signUp;
const getAuthenticatedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authUser = req.user;
    try {
        (0, assertIsDefined_1.default)(authUser);
        const user = yield user_1.default.findById(authUser._id).select("+email").exec();
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getAuthenticatedUser = getAuthenticatedUser;
const logOut = (req, res) => {
    req.logOut(error => {
        if (error)
            throw error;
        res.sendStatus(200);
    });
};
exports.logOut = logOut;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, displayName, about } = req.body;
    const profileImage = req.file;
    const authUser = req.user;
    try {
        (0, assertIsDefined_1.default)(authUser);
        if (username) {
            const existingUsername = yield user_1.default.findOne({ username }).collation({ locale: "en", strength: 2 }).exec();
            if (existingUsername) {
                throw (0, http_errors_1.default)(409, "username taken");
            }
        }
        let profileImageDestPath = undefined;
        if (profileImage) {
            profileImageDestPath = "/uploads/profile-pictures/" + authUser._id + ".png";
            yield (0, sharp_1.default)(profileImage.buffer).resize(500, 500, { withoutEnlargement: true }).toFile("./" + profileImageDestPath);
        }
        const updatedUser = yield user_1.default.findByIdAndUpdate(authUser._id, {
            $set: Object.assign(Object.assign(Object.assign(Object.assign({}, (username && { username })), (displayName && { displayName })), (about && { about })), (profileImage && { profilePicUrl: env_1.default.SERVER_URL + profileImageDestPath + "?lastUpdated=" + Date.now() }))
        }, { new: true }).exec();
        res.status(200).json(updatedUser);
    }
    catch (error) {
        next(error);
    }
});
exports.updateUser = updateUser;
