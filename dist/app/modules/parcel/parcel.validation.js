"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateParcelZodSchema = exports.createParcelZodSchema = void 0;
const zod_1 = require("zod");
const parcel_interface_1 = require("./parcel.interface");
exports.createParcelZodSchema = zod_1.z.object({
    sender: zod_1.z
        .string({ error: "Sender must be a valid user ID" })
        .min(1, { message: "Sender ID is required" })
        .optional(),
    receiver: zod_1.z
        .string({ error: "Receiver must be a valid user ID" })
        .min(1, { message: "Receiver ID is required" }),
    trackingId: zod_1.z
        .string({ error: "Tracking ID must be a string" })
        .min(1, { message: "Tracking ID is required" })
        .optional(),
    parcelType: zod_1.z.enum(Object.values(parcel_interface_1.ParcelType), {
        error: "Parcel type is required",
    }),
    weight: zod_1.z
        .number({ error: "Weight must be a number" })
        .positive({ message: "Weight must be greater than 0" }),
    deliveryMethod: zod_1.z.enum(Object.values(parcel_interface_1.DeliveryMethod), {
        error: "Delivery method is required",
    }),
    deliveryAddress: zod_1.z
        .string({ error: "Delivery address must be a string" })
        .min(5, { message: "Delivery address is too short" }),
    pickupAddress: zod_1.z
        .string({ error: "Pickup address must be a string" })
        .min(5, { message: "Pickup address is too short" }),
    deliveryDistance: zod_1.z.number({ error: "Delivery distance must be a number" }),
    contactPhone: zod_1.z
        .string({ error: "Contact phone must be a string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    }),
    currentStatus: zod_1.z.enum(Object.values(parcel_interface_1.ParcelStatus)).optional(),
    estimatedDeliveryDate: zod_1.z.coerce
        .date()
        .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
        message: "Estimated delivery date must be a valid date",
    }),
    paymentMethod: zod_1.z.enum(Object.values(parcel_interface_1.PaymentMethod), {
        error: "Payment method is required",
    }),
    isPaid: zod_1.z
        .boolean({ error: "It must be true or false" })
        .optional()
        .default(false),
    isCancelled: zod_1.z
        .boolean({ error: "It must be true or false" })
        .optional()
        .default(false),
    isBlocked: zod_1.z
        .boolean({ error: "It must be true or false" })
        .optional()
        .default(false),
    trackingEvents: zod_1.z
        .array(zod_1.z.object({
        status: zod_1.z.enum(Object.values(parcel_interface_1.ParcelStatus)),
        location: zod_1.z.string().optional(),
        note: zod_1.z.string().optional(),
        updatedBy: zod_1.z.string().optional(),
    }))
        .optional(),
    coupon: zod_1.z
        .string()
        .optional()
        .or(zod_1.z.literal("").transform(() => undefined)),
    discountAmount: zod_1.z
        .string({ error: "Discount must be a string" })
        .optional(),
    deliveryFee: zod_1.z
        .number({ error: "Delivery fee must be a number" })
        .nonnegative({ message: "Delivery fee cannot be negative" })
        .optional(),
    afterDiscountDeliveryFee: zod_1.z
        .number({ error: "Final fee must be a number" })
        .nonnegative()
        .optional(),
});
// Zod schema for updating a parcel (partial)
exports.updateParcelZodSchema = exports.createParcelZodSchema.partial();
