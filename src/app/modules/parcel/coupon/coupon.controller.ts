import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";

import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

import sendResponse from "../../../utils/sendResponse";
import { CouponService } from "./coupon.service";

export const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const email = (req.user as JwtPayload).email;
  const coupon = await CouponService.createCoupon(req.body, email);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Coupon Created Successfully",
    data: coupon,
  });
});

export const getAllCoupons = catchAsync(async (req: Request, res: Response) => {
    const email = (req.user as JwtPayload).email;
  const coupons = await CouponService.getAllCoupons(email);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Coupons Retrieved Successfully",
    data: coupons,
  });
});

export const getSingleCoupon = catchAsync(async (req: Request, res: Response) => {
    const email = (req.user as JwtPayload).email;
  const id = req.params.id;
  const coupon = await CouponService.getSingleCoupon(id, email);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Coupon Retrieved Successfully",
    data: coupon,
  });
});

export const updateCoupon = catchAsync(async (req: Request, res: Response) => {
    const email = (req.user as JwtPayload).email;
  const id = req.params.id;
  const updatedCoupon = await CouponService.updateCoupon(id, req.body, email);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Coupon Updated Successfully",
    data: updatedCoupon,
  });
});

export const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
    const email = (req.user as JwtPayload).email;
  const id = req.params.id;
  await CouponService.deleteCoupon(id, email);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Coupon Deleted Successfully",
    data: null,
  });
});

export const CouponController = {
    createCoupon,
    getAllCoupons,
    getSingleCoupon,
    updateCoupon,
    deleteCoupon
} 