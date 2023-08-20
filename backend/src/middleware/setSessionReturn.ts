import { RequestHandler } from "express";
import env from "../env";

const setSessionReturn: RequestHandler = (req, res, next) => {
    const {returnTo} = req.query;
    if(returnTo) {
        req.session.returnTo = env.FRONTEND_URL + returnTo;
    }
    next();
}

export default setSessionReturn;