import { InferSchemaType, Schema, model } from "mongoose";

const emailVerTokenSchema = new Schema({
    email: {type:String, required:true},
    verificationCode: {type:String, required:true},
    createdAt: {type:Date, default:Date.now, expires:"10m"},
});

export type EmailVerToken = InferSchemaType<typeof emailVerTokenSchema>;

export default model<EmailVerToken>("EmailVerToken",emailVerTokenSchema);