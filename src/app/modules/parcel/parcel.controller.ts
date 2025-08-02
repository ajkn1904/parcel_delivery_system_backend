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
      message: "Parcel Created Successfully",
      data: parcel,
    });
});


const getAllParcels = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const parcel = await ParcelService.getAllParcels(user.email);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Parcel Retrieved Successfully",
      data: parcel,
    });
});


const getSingleParcel = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const parcelId = req.params.id;
    const parcel = await ParcelService.getSingleParcel(parcelId, user.email, user.role);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Parcel Retrieved Successfully",
      data: parcel,
    });
});


const updateParcelStatus = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const parcelId = req.params.id;
    const parcel = await ParcelService.updateParcelStatus(parcelId, user.email);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Parcel Updated Successfully",
      data: parcel,
    });
});


const updateParcelStatusByAdmin = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const parcelId = req.params.id;
    const parcel = await ParcelService.updateParcelStatusByAdmin(req.body, parcelId, user.email);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Parcel Updated Successfully",
      data: parcel,
    });
});

export const ParcelController = {
    createParcel,
    getAllParcels,
    getSingleParcel,
    updateParcelStatus,
    updateParcelStatusByAdmin
  }