import mongoose from "mongoose";
import { validateBufferMIMEType } from "validate-image-type";
import * as yup from "yup";

export const imageFileSchema = yup.mixed<Express.Multer.File>()
.test("validImage", "Uploaded file is not a valid image", 
async file => {
    if(!file) return true;
    const result = await validateBufferMIMEType(file.buffer, {
        allowMimeTypes:["image/png", "image/jpeg"]
    });

    return result.ok
});

export const ObjectIdSchema = yup.string().test("is-objectId","${path} is not a valid ObjectId", value => !value || mongoose.Types.ObjectId.isValid(value));