import { RequestHandler } from "express";
import UserModel from "../models/user";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
interface signUpBody {
    username: string,
    email:string,
    password:string,
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
        if(!authUser) throw createHttpError(401);

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