"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = __importDefault(require("./env"));
const node_dns_1 = __importDefault(require("node:dns"));
node_dns_1.default.setDefaultResultOrder("ipv4first");
const port = env_1.default.PORT;
mongoose_1.default.connect(env_1.default.MONGO_CONNECTION_STRING)
    .then(() => {
    console.log("mongoose connected");
    app_1.default.listen(port, () => console.log("server running on port: " + port));
})
    .catch(console.error);
