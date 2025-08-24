import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { ParcelAnalyticsService } from "./analytic.service";
import { JwtPayload } from "jsonwebtoken";

const getDeliveryStatusDistribution = catchAsync(async (req: Request, res: Response) => {
    const user = (req.user as JwtPayload).email;
  const result = await ParcelAnalyticsService.getDeliveryStatusDistribution(user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Delivery status distribution retrieved successfully",
    data: result,
  });
});

const getMonthlyShipments = catchAsync(async (req: Request, res: Response) => {
  const user = (req.user as JwtPayload).email;
  const result = await ParcelAnalyticsService.getMonthlyShipments(user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Monthly shipments retrieved successfully",
    data: result,
  });
});

const getParcelTrends = catchAsync(async (req: Request, res: Response) => {
  const user = (req.user as JwtPayload).email;
  const result = await ParcelAnalyticsService.getParcelTrends(user);
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
