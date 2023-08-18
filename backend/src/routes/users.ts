import express from "express";
import * as UsersController from "../controllers/users";
import passport from "passport";
import requiresAuth from "../middleware/requiresAuth";
import validateRequestSchema from "../middleware/validateRequestSchema";
import { signUpSchema, updateUserSchema } from "../validation/users";
import { profileImageUpload } from "../middleware/image-upload";

const router = express.Router();
router.get("/profile/:username",UsersController.getUserByUsername);
router.patch("/me", requiresAuth, profileImageUpload.single("profileImage"), validateRequestSchema(updateUserSchema), UsersController.updateUser)
router.get("/me",requiresAuth, UsersController.getAuthenticatedUser);
router.post("/signup", validateRequestSchema(signUpSchema), UsersController.signUp);
router.post("/login", passport.authenticate("local"), (req,res) => res.status(200).json(req.user));
router.post("/logout", UsersController.logOut);
export default router;