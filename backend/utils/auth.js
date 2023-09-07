"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyAllActiveSessionsForUser = void 0;
const redisClient_1 = __importDefault(require("../config/redisClient"));
function destroyAllActiveSessionsForUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let cursor = 0;
        do {
            const result = yield redisClient_1.default.scan(cursor, { MATCH: `sees:${userId}*`, COUNT: 1000 });
            for (const key of result.keys) {
                yield redisClient_1.default.del(key);
            }
            cursor = result.cursor;
        } while (cursor !== 0);
    });
}
exports.destroyAllActiveSessionsForUser = destroyAllActiveSessionsForUser;
