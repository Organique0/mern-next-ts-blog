import express from "express";
import * as UsersController from "../controllers/users";
import passport from "passport";
import requiresAuth from "../middleware/requiresAuth";
import validateRequestSchema from "../middleware/validateRequestSchema";
import { passResetSchema, requestVerificationCodeSchema, signUpSchema, updateUserSchema } from "../validation/users";
import { profileImageUpload } from "../middleware/image-upload";
import env from "../env";
import setSessionReturn from "../middleware/setSessionReturn";
import { loginRateLimit, requestVerificationCodeRateLimit } from "../middleware/rate-limit";

const router = express.Router();
router.get("/profile/:username",UsersController.getUserByUsername);
router.patch("/me", requiresAuth, profileImageUpload.single("profileImage"), validateRequestSchema(updateUserSchema), UsersController.updateUser)
router.get("/me",requiresAuth, UsersController.getAuthenticatedUser);
router.post("/signup", validateRequestSchema(signUpSchema), UsersController.signUp);
router.post("/verification-code",requestVerificationCodeRateLimit, validateRequestSchema(requestVerificationCodeSchema), UsersController.requestVerificationCode);
router.post("/reset-password-code",requestVerificationCodeRateLimit, validateRequestSchema(requestVerificationCodeSchema), UsersController.requestPasswordResetCode);
router.post("/reset-password", validateRequestSchema(passResetSchema), UsersController.resetPassword);
router.get("/login/google", setSessionReturn, passport.authenticate("google"));
router.get("/login/github", setSessionReturn, passport.authenticate("github"));
router.get("/oauth2/redirect/google", passport.authenticate("google",{
    successReturnToOrRedirect: env.FRONTEND_URL,
    keepSessionInfo:true,
}));
router.get("/oauth2/redirect/github", passport.authenticate("github",{
    successReturnToOrRedirect: env.FRONTEND_URL,
    keepSessionInfo:true,
}));
router.post("/login", loginRateLimit,passport.authenticate("local"), (req,res) => res.status(200).json(req.user));
router.post("/logout", UsersController.logOut);
export default router;