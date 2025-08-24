import { Router } from "express";

import { checkAuth } from "../../middlewares/checkAuth";
import { ParcelAnalyticsController } from "./analytics.controller";
import { Role } from "../user/user.interface";

const router = Router();

// Only admin can access analytics
router.get("/status-distribution", checkAuth(Role.admin), ParcelAnalyticsController.getDeliveryStatusDistribution);
router.get("/monthly-shipments", checkAuth(Role.admin), ParcelAnalyticsController.getMonthlyShipments);
router.get("/trends", checkAuth(Role.admin), ParcelAnalyticsController.getParcelTrends);

export const ParcelAnalyticRoutes = router;
