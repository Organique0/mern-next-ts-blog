import { InferSchemaType, Schema, model } from "mongoose";

const passResetTokenSchema = new Schema({
    email: {type:String, required:true},
    verificationCode: {type:String, required:true},
    createdAt: {type:Date, default:Date.now, expires:"10m"},
});

export type passResetToken = InferSchemaType<typeof passResetTokenSchema>;

export default model<passResetToken>("passResetToken",passResetTokenSchema);