"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateZodSchema = exports.createZodSchema = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("./user.interface");
//zod schema for create user validation
exports.createZodSchema = zod_1.z.object({
    name: zod_1.z
        .string({ error: "Name is required and it must be a string" })
        .min(2, { message: "Name required minimum 2 characters" })
        .max(50, { message: "Name must be less than 50 characters" })
        .trim(),
    email: zod_1.z
        .string({ error: "Email is required and it must be a string" })
        .email({ message: "Invalid email format" })
        .max(100, { message: "Email cannot exceed 100 characters" })
        .trim(),
    password: zod_1.z
        .string({ error: "Password is required and it must be a string" })
        .min(6, { message: "Password must be at least 6 characters" })
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
    }),
    role: zod_1.z.enum(Object.values(user_interface_1.Role)),
    phone: zod_1.z
        .string({ error: "Phone must be a string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    address: zod_1.z
        .string({ error: "Address must be a string" })
        .max(200, { message: "Address cannot exceed 200 characters" })
        .optional(),
});
//zod schema for update user validation
exports.updateZodSchema = zod_1.z.object({
    name: zod_1.z
        .string({ error: "Name must be a string" })
        .min(2, { message: "Name required minimum 2 characters" })
        .max(50, { message: "Name must be less than 50 characters" })
        .trim()
        .optional(),
    email: zod_1.z
        .string({ error: "Email must be a string" })
        .email({ message: "Invalid email format" })
        .max(100, { message: "Email cannot exceed 100 characters" })
        .trim()
        .optional(),
    password: zod_1.z
        .string({ error: "Password must be a string" })
        .min(6, { message: "Password must be at least 6 characters" })
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
    })
        .optional(),
    phone: zod_1.z
        .string({ error: "Phone must be a string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    address: zod_1.z
        .string({ error: "Address must be a string" })
        .max(200, { message: "Address cannot exceed 200 characters" })
        .optional(),
    role: zod_1.z.enum(Object.values(user_interface_1.Role)).optional(),
    isDeleted: zod_1.z
        .boolean({ error: "isDeleted must be true or false" })
        .optional(),
    isBlocked: zod_1.z
        .boolean({ error: "isBlocked must be true or false" })
        .optional(),
});
