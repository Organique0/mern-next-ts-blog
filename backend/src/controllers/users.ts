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

        res.status(201).json(newUser);

    } catch (error) {
        next(error);
    }
}