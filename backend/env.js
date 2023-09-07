"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
const env = (0, envalid_1.cleanEnv)(process.env, {
    NODE_ENV: (0, envalid_1.str)(),
    PORT: (0, envalid_1.port)(),
    MONGO_CONNECTION_STRING: (0, envalid_1.str)(),
    FRONTEND_URL: (0, envalid_1.str)(),
    SERVER_URL: (0, envalid_1.str)(),
    SESSION_SECRET: (0, envalid_1.str)(),
    POST_REVALIDATION_KEY: (0, envalid_1.str)(),
    GOOGLE_CLIENT_SECRET: (0, envalid_1.str)(),
    GOOGLE_CLIENT_ID: (0, envalid_1.str)(),
    GITHUB_CLIENT_ID: (0, envalid_1.str)(),
    GITHUB_CLIENT_SECRET: (0, envalid_1.str)(),
    SMTP_PASSWORD: (0, envalid_1.str)(),
});
exports.default = env;
