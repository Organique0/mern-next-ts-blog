import { cleanEnv, port, str } from "envalid";

const env = cleanEnv(process.env,{
    PORT: port(),
    MONGO_CONNECTION_STRING: str(),
    FRONTEND_URL: str(),
});

export default env;