"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function assertIsDefined(value) {
    if (!value) {
        throw Error("Expected value to be defined, but received " + value);
    }
}
exports.default = assertIsDefined;
