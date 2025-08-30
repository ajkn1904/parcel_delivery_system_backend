import { z } from "zod";
import {
  ParcelType,
  ParcelStatus,
  PaymentMethod,
  DeliveryMethod,
} from "./parcel.interface";

export const createParcelZodSchema = z.object({
  sender: z
    .string({ error: "Sender must be a valid user ID" })
    .min(1, { message: "Sender ID is required" })
    .optional(),

  receiver: z
    .string({ error: "Receiver must be a valid user ID" })
    .min(1, { message: "Receiver ID is required" }),

  trackingId: z
    .string({ error: "Tracking ID must be a string" })
    .min(1, { message: "Tracking ID is required" })
    .optional(),

  parcelType: z.enum(Object.values(ParcelType) as [string], {
    error: "Parcel type is required",
  }),

  weight: z
    .number({ error: "Weight must be a number" })
    .positive({ message: "Weight must be greater than 0" }),

  deliveryMethod: z.enum(Object.values(DeliveryMethod) as [string], {
    error: "Delivery method is required",
  }),

  deliveryAddress: z
    .string({ error: "Delivery address must be a string" })
    .min(5, { message: "Delivery address is too short" }),

  pickupAddress: z
    .string({ error: "Pickup address must be a string" })
    .min(5, { message: "Pickup address is too short" }),

  deliveryDistance: z.number({ error: "Delivery distance must be a number" }),

  contactPhone: z
    .string({ error: "Contact phone must be a string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    }),

  currentStatus: z.enum(Object.values(ParcelStatus) as [string]).optional(),

  estimatedDeliveryDate: z.coerce
    .date()
    .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
      message: "Estimated delivery date must be a valid date",
    }),

  paymentMethod: z.enum(Object.values(PaymentMethod) as [string], {
    error: "Payment method is required",
  }),

  isPaid: z
    .boolean({ error: "It must be true or false" })
    .optional()
    .default(false),

  isCancelled: z
    .boolean({ error: "It must be true or false" })
    .optional()
    .default(false),

  isBlocked: z
    .boolean({ error: "It must be true or false" })
    .optional()
    .default(false),

  trackingEvents: z
    .array(
      z.object({
        status: z.enum(Object.values(ParcelStatus) as [string]),
        location: z.string().optional(),
        note: z.string().optional(),
        updatedBy: z.string().optional(),
      })
    )
    .optional(),


  coupon: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),

  discountAmount: z
    .string({ error: "Discount must be a string" })
    .optional(),


  deliveryFee: z
    .number({ error: "Delivery fee must be a number" })
    .nonnegative({ message: "Delivery fee cannot be negative" })
    .optional(),

  afterDiscountDeliveryFee: z
    .number({ error: "Final fee must be a number" })
    .nonnegative()
    .optional(),
});

// Zod schema for updating a parcel (partial)
export const updateParcelZodSchema = createParcelZodSchema.partial();


export const updateParcelStatusByAdminZodSchema = z.object({
  currentStatus: z.enum(Object.values(ParcelStatus) as [string]),
  note: z.string().optional(),
  location: z.string().optional(),
});
