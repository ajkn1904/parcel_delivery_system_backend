"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationError = void 0;
const handleValidationError = (err) => {
    const errorSources = [];
    const errors = Object.values(err.errors);
    errors.forEach((errorObject) => errorSources.push({
        name: errorObject.path,
        message: errorObject.message
    }));
    return {
        statusCode: 400,
        message: "Validation Error",
        errorSources
    };
};
exports.handleValidationError = handleValidationError;
