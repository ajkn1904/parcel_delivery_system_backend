import { Router } from "express";

import { checkAuth } from "../../middlewares/checkAuth";
import { ParcelAnalyticsController } from "./analytics.controller";
import { Role } from "../user/user.interface";

const router = Router();


router.get("/status-distribution", checkAuth(Role.admin, Role.sender), ParcelAnalyticsController.getDeliveryStatusDistribution);
router.get("/monthly-shipments", checkAuth(...Object.values(Role)), ParcelAnalyticsController.getMonthlyShipments);
router.get("/trends", checkAuth(Role.admin, Role.sender), ParcelAnalyticsController.getParcelTrends);
router.get("/overview", checkAuth(...Object.values(Role)), ParcelAnalyticsController.getOverviewData);

//receiver only
router.get("/receiver/success-metrics", checkAuth(Role.receiver), ParcelAnalyticsController.getReceiverSuccessMetrics);
router.get("/receiver/delivery-performance", checkAuth(Role.receiver), ParcelAnalyticsController.getReceiverDeliveryPerformance);

export const ParcelAnalyticRoutes = router;
