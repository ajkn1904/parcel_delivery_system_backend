"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelAnalyticRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const analytics_controller_1 = require("./analytics.controller");
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
// Only admin can access analytics
router.get("/status-distribution", (0, checkAuth_1.checkAuth)(user_interface_1.Role.admin, user_interface_1.Role.sender), analytics_controller_1.ParcelAnalyticsController.getDeliveryStatusDistribution);
router.get("/monthly-shipments", (0, checkAuth_1.checkAuth)(user_interface_1.Role.admin, user_interface_1.Role.sender), analytics_controller_1.ParcelAnalyticsController.getMonthlyShipments);
router.get("/trends", (0, checkAuth_1.checkAuth)(user_interface_1.Role.admin, user_interface_1.Role.sender), analytics_controller_1.ParcelAnalyticsController.getParcelTrends);
exports.ParcelAnalyticRoutes = router;
