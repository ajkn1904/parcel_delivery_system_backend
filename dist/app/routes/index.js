"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const parcel_route_1 = require("../modules/parcel/parcel.route");
const coupon_route_1 = require("../modules/parcel/coupon/coupon.route");
const analytic_route_1 = require("../modules/analytics/analytic.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/parcel",
        route: parcel_route_1.ParcelRoutes,
    },
    {
        path: "/coupon",
        route: coupon_route_1.CouponRoutes,
    },
    {
        path: "/analytics",
        route: analytic_route_1.ParcelAnalyticRoutes,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
exports.default = exports.router;
