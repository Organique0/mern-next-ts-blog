import multer from "multer";

export const featuredImageUpload = multer({
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter(req, file, callback) {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
            callback(null, true);
        } else {
            callback(new Error("Unsupported image format"));
        }
    }
});

export const profileImageUpload = multer({
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter(req, file, callback) {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
            callback(null, true);
        } else {
            callback(new Error("Unsupported image format"));
        }
    }
})

export const inPostImageUpload = multer({
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter(req, file, callback) {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
            callback(null, true);
        } else {
            callback(new Error("Unsupported image format"));
        }
    }
})