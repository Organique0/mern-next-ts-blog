import { cleanEnv, port, str } from "envalid";

const env = cleanEnv(process.env,{
    PORT: port(),
    MONGO_CONNECTION_STRING: str(),
    FRONTEND_URL: str(),
    SERVER_URL: str(),
    SESSION_SECRET: str(),
    POST_REVALIDATION_KEY:str(),

});

export default env;