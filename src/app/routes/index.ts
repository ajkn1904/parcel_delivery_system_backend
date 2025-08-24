import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ParcelRoutes } from "../modules/parcel/parcel.route";
import { CouponRoutes } from "../modules/parcel/coupon/coupon.route";
import { ParcelAnalyticRoutes } from "../modules/analytics/analytic.route";

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
        route: CouponRoutes,
    },
    {
        path: "/analytics",
        route: ParcelAnalyticRoutes,
    },
]


moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
export default router;