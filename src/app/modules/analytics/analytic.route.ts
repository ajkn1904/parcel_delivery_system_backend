import { Router } from "express";

import { checkAuth } from "../../middlewares/checkAuth";
import { ParcelAnalyticsController } from "./analytics.controller";
import { Role } from "../user/user.interface";

const router = Router();

// Only admin can access analytics
router.get("/status-distribution", checkAuth(Role.admin, Role.sender), ParcelAnalyticsController.getDeliveryStatusDistribution);
router.get("/monthly-shipments", checkAuth(Role.admin, Role.sender), ParcelAnalyticsController.getMonthlyShipments);
router.get("/trends", checkAuth(Role.admin, Role.sender), ParcelAnalyticsController.getParcelTrends);

export const ParcelAnalyticRoutes = router;
