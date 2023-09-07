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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_github2_1 = require("passport-github2");
const env_1 = __importDefault(require("../env"));
passport_1.default.serializeUser((user, cb) => {
    cb(null, user._id);
});
passport_1.default.deserializeUser((userId, cb) => {
    cb(null, { _id: new mongoose_1.default.Types.ObjectId(userId) });
});
passport_1.default.use(new passport_local_1.Strategy((username, password, cb) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield user_1.default.findOne({ username }).select("+email +password").exec();
        if (!existingUser || !existingUser.password) {
            return cb(null, false);
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, existingUser.password);
        if (!passwordMatch) {
            return cb(null, false);
        }
        const user = existingUser.toObject();
        delete user.password;
        return cb(null, user);
    }
    catch (error) {
        cb(error);
    }
})));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.default.GOOGLE_CLIENT_ID,
    clientSecret: env_1.default.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.default.SERVER_URL + "/users/oauth2/redirect/google",
    scope: ["profile"],
}, (accessToken, refreshToken, profile, cb) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield user_1.default.findOne({ googleId: profile.id }).exec();
        if (!user) {
            user = yield user_1.default.create({
                googleId: profile.id,
            });
        }
        cb(null, user);
    }
    catch (error) {
        if (error instanceof Error) {
            cb(error);
        }
        else {
            throw error;
        }
    }
})));
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: env_1.default.GITHUB_CLIENT_ID,
    clientSecret: env_1.default.GITHUB_CLIENT_SECRET,
    callbackURL: "/users/oauth2/redirect/github",
}, (accessToken, refreshToken, profile, cb) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield user_1.default.findOne({ githubId: profile.id }).exec();
        if (!user) {
            user = yield user_1.default.create({
                githubId: profile.id,
            });
        }
        cb(null, user);
    }
    catch (error) {
        if (error instanceof Error) {
            cb(error);
        }
        else {
            throw error;
        }
    }
})));
