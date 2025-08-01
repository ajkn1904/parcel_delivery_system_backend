import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ParcelService } from "./parcel.service";
import { JwtPayload } from "jsonwebtoken";

const createParcel = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const parcel = await ParcelService.createParcel(req.body, user.email);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Parcel created successfully",
      data: parcel,
    });
});

export const ParcelController = {
    createParcel,
  }