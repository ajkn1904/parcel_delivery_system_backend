import { Router } from "express";
import { checkAuth } from "../../../middlewares/checkAuth";
import { Role } from "../../user/user.interface";
import { validationRequest } from "../../../middlewares/validationRequest";
import { createCouponZodSchema, updateCouponZodSchema } from "./coupon.validation";
import { CouponController } from "./coupon.controller";


const router = Router();

router.post("/", checkAuth(Role.admin, Role.sender), validationRequest(createCouponZodSchema), CouponController.createCoupon);

router.get("/", checkAuth(Role.admin, Role.sender), CouponController.getAllCoupons);

router.get("/:id", checkAuth(Role.admin, Role.sender), CouponController.getSingleCoupon);

router.patch("/:id", checkAuth(Role.admin, Role.sender), validationRequest(updateCouponZodSchema), CouponController.updateCoupon);

router.delete("/:id", checkAuth(Role.admin, Role.sender), CouponController.deleteCoupon);


export const CouponRoutes = router;