import { cleanEnv, port, str } from "envalid";

const env = cleanEnv(process.env, {
    PORT: port(),
    MONGO_CONNECTION_STRING: str(),
    FRONTEND_URL: str(),
    SERVER_URL: str(),
    SESSION_SECRET: str(),
    POST_REVALIDATION_KEY: str(),
    GOOGLE_CLIENT_SECRET: str(),
    GOOGLE_CLIENT_ID: str(),
    GITHUB_CLIENT_ID: str(),
    GITHUB_CLIENT_SECRET: str(),
    SMTP_PASSWORD: str(),
    S3_SECRET_ACCESS_KEY: str(),
    S3_ACCESS_KEY: str(),

});

export default env;