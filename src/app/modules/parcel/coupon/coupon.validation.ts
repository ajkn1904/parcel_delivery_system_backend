import {z} from "zod";


export const createCouponZodSchema = z.object({
  body: z.object({
    code: z.string().min(1),
    discountPercentage: z.number().min(1).max(100),
    expiryDate: z.string().datetime(),
  }),
});

export const updateCouponZodSchema = createCouponZodSchema.partial();