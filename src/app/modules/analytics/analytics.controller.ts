import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { ParcelAnalyticsService } from "./analytic.service";

const getDeliveryStatusDistribution = catchAsync(async (req: Request, res: Response) => {
  const result = await ParcelAnalyticsService.getDeliveryStatusDistribution();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Delivery status distribution retrieved successfully",
    data: result,
  });
});

const getMonthlyShipments = catchAsync(async (req: Request, res: Response) => {
  const result = await ParcelAnalyticsService.getMonthlyShipments();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Monthly shipments retrieved successfully",
    data: result,
  });
});

const getParcelTrends = catchAsync(async (req: Request, res: Response) => {
  const result = await ParcelAnalyticsService.getParcelTrends();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Parcel trends retrieved successfully",
    data: result,
  });
});


export const ParcelAnalyticsController = {
    getDeliveryStatusDistribution,
    getMonthlyShipments,
    getParcelTrends
};
