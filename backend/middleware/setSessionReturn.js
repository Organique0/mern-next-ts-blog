"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("../env"));
const setSessionReturn = (req, res, next) => {
    const { returnTo } = req.query;
    if (returnTo) {
        req.session.returnTo = env_1.default.FRONTEND_URL + returnTo;
    }
    next();
};
exports.default = setSessionReturn;
