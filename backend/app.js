"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const blog_posts_1 = __importDefault(require("./routes/blog-posts"));
const users_1 = __importDefault(require("./routes/users"));
const cors_1 = __importDefault(require("cors"));
const env_1 = __importDefault(require("./env"));
const morgan_1 = __importDefault(require("morgan"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const http_errors_1 = __importDefault(require("http-errors"));
const express_session_1 = __importDefault(require("express-session"));
const session_1 = __importDefault(require("./config/session"));
const passport_1 = __importDefault(require("passport"));
require("./config/passport");
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: env_1.default.FRONTEND_URL,
    credentials: true,
}));
app.use((0, express_session_1.default)(session_1.default));
app.use(passport_1.default.authenticate("session"));
app.use("/uploads/featured-images", express_1.default.static("uploads/featured-images"));
app.use("/uploads/profile-pictures", express_1.default.static("uploads/profile-pictures"));
app.use("/uploads/in-post-images", express_1.default.static("uploads/in-post-images"));
app.use("/posts", blog_posts_1.default);
app.use("/users", users_1.default);
app.use((req, res, next) => next((0, http_errors_1.default)(404, "Endpoint not found")));
app.use(errorHandler_1.default);
exports.default = app;
