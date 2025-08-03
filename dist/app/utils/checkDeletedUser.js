"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureUserNotDeleted = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../errorHelper/AppError"));
const ensureUserNotDeleted = (user) => {
    if (!user || user.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Your Account has been Deleted! Create a New Account or Contact Support to Restore Your Account.");
    }
};
exports.ensureUserNotDeleted = ensureUserNotDeleted;
