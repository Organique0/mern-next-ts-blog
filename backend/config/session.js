"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("../env"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const crypto_1 = __importDefault(require("crypto"));
const redisClient_1 = __importDefault(require("./redisClient"));
const sessionConfig = {
    secret: env_1.default.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    rolling: true,
    store: new connect_redis_1.default({
        client: redisClient_1.default,
    }),
    genid(req) {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const randomId = crypto_1.default.randomUUID();
        if (userId) {
            return `${userId}-${randomId}`;
        }
        else {
            return randomId;
        }
    }
};
exports.default = sessionConfig;
