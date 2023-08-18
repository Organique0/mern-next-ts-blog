import { RequestHandler } from "express";
import UserModel from "../models/user";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import assertIsDefined from "../utils/assertIsDefined";
import { UpdateUserBody } from "../validation/users";
import sharp from "sharp";
import env from "../env";
interface signUpBody {
    username: string,
    email:string,
    password:string,
}

export const getUserByUsername:RequestHandler = async (req,res,next) => {
    try {
        const user = await UserModel.findOne({username: req.params.username}).exec();

        if(!user) throw createHttpError(404, "User not found");

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

export const signUp: RequestHandler<unknown, unknown, signUpBody, unknown> = async (req,res,next) => {
    const {username, email, password} = req.body;
    try {
        const existingUsername = await UserModel.findOne({username}).collation({ locale: "en", strength:2 }).exec();

        if(existingUsername) {
            throw createHttpError(409, "username taken");
        }

        const passwordHashed = await bcrypt.hash(password,10);

        const result = await UserModel.create({
            username,
            displayName: username,
            email,
            password:passwordHashed,
        });

        const newUser = result.toObject();
        delete newUser.password;

        req.logIn(newUser,error => {
            if(error) throw error;
            res.status(201).json(newUser);
        });
        
    } catch (error) {
        next(error);
    }
}

export const getAuthenticatedUser:RequestHandler = async (req, res, next) => {
    const authUser = req.user;
    try {
        assertIsDefined(authUser);

        const user = await UserModel.findById(authUser._id).select("+email").exec();

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

export const logOut: RequestHandler = (req,res) => {
    req.logOut(error => {
        if (error) throw error;
        res.sendStatus(200);
    })
}

export const updateUser :RequestHandler<unknown, unknown, UpdateUserBody, unknown> = async (req,res,next) => {
    const { username, displayName, about } = req.body;
    const profileImage = req.file;
    const authUser = req.user;

    try {
        assertIsDefined(authUser);

        if(username){
            const existingUsername = await UserModel.findOne({username}).collation({ locale: "en", strength:2 }).exec();

            if(existingUsername) {
                throw createHttpError(409, "username taken");
            }
        }

        let profileImageDestPath:string | undefined = undefined;

        if(profileImage) {
            profileImageDestPath = "/uploads/profile-pictures/" + authUser._id + ".png";

            await sharp(profileImage.buffer).resize(500,500, { withoutEnlargement: true }).toFile("./" + profileImageDestPath);
        }

        const updatedUser = await UserModel.findByIdAndUpdate(authUser._id, {
            $set: {
                ...(username && {username}),
                ...(displayName && {displayName}),
                ...(about && {about}),
                ...(profileImage && {profilePicUrl:env.SERVER_URL + profileImageDestPath}),
            }
        }, { new:true }).exec();

        res.status(200).json(updatedUser);

    } catch (error) {
        next(error);
    }
}