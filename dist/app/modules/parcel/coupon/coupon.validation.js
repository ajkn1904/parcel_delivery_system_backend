"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCouponZodSchema = exports.createCouponZodSchema = void 0;
const zod_1 = require("zod");
exports.createCouponZodSchema = zod_1.z.object({
    code: zod_1.z.string().min(1),
    discountPercentage: zod_1.z.number().min(1).max(100),
    expiryDate: zod_1.z.string().datetime(),
});
exports.updateCouponZodSchema = exports.createCouponZodSchema.partial();
