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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UsersController = __importStar(require("../controllers/users"));
const passport_1 = __importDefault(require("passport"));
const requiresAuth_1 = __importDefault(require("../middleware/requiresAuth"));
const validateRequestSchema_1 = __importDefault(require("../middleware/validateRequestSchema"));
const users_1 = require("../validation/users");
const image_upload_1 = require("../middleware/image-upload");
const env_1 = __importDefault(require("../env"));
const setSessionReturn_1 = __importDefault(require("../middleware/setSessionReturn"));
const rate_limit_1 = require("../middleware/rate-limit");
const router = express_1.default.Router();
router.get("/profile/:username", UsersController.getUserByUsername);
router.patch("/me", requiresAuth_1.default, image_upload_1.profileImageUpload.single("profileImage"), (0, validateRequestSchema_1.default)(users_1.updateUserSchema), UsersController.updateUser);
router.get("/me", requiresAuth_1.default, UsersController.getAuthenticatedUser);
router.post("/signup", (0, validateRequestSchema_1.default)(users_1.signUpSchema), UsersController.signUp);
router.post("/verification-code", rate_limit_1.requestVerificationCodeRateLimit, (0, validateRequestSchema_1.default)(users_1.requestVerificationCodeSchema), UsersController.requestVerificationCode);
router.post("/reset-password-code", rate_limit_1.requestVerificationCodeRateLimit, (0, validateRequestSchema_1.default)(users_1.requestVerificationCodeSchema), UsersController.requestPasswordResetCode);
router.post("/reset-password", (0, validateRequestSchema_1.default)(users_1.passResetSchema), UsersController.resetPassword);
router.get("/login/google", setSessionReturn_1.default, passport_1.default.authenticate("google"));
router.get("/login/github", setSessionReturn_1.default, passport_1.default.authenticate("github"));
router.get("/oauth2/redirect/google", passport_1.default.authenticate("google", {
    successReturnToOrRedirect: env_1.default.FRONTEND_URL,
    keepSessionInfo: true,
}));
router.get("/oauth2/redirect/github", passport_1.default.authenticate("github", {
    successReturnToOrRedirect: env_1.default.FRONTEND_URL,
    keepSessionInfo: true,
}));
router.post("/login", rate_limit_1.loginRateLimit, passport_1.default.authenticate("local"), (req, res) => res.status(200).json(req.user));
router.post("/logout", UsersController.logOut);
exports.default = router;
