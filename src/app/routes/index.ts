import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ParcelRoutes } from "../modules/parcel/parcel.route";
import { CouponRoutes } from "../modules/parcel/coupon/coupon.route";

export const router = Router();

const moduleRoutes = [
    {
        path: "/user",
        route:UserRoutes,
    },
    {
        path: "/auth",
        route:AuthRoutes,
    },
    {
        path: "/parcel",
        route:ParcelRoutes,
    },
    {
        path: "/coupon",
        route:CouponRoutes,
    },
]


moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
export default router;