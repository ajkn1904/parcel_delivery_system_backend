import { StatusCodes } from "http-status-codes";
import { ICoupon } from "../parcel.interface";
import { Coupon } from "../parcel.model";
import AppError from "../../../errorHelper/AppError";
import { User } from "../../user/user.model";


const ensureAdminOrSender = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  if (user.role !== "admin" && user.role !== "sender") {
    throw new AppError(StatusCodes.FORBIDDEN, "Only admin or sender can manage coupons");
  }
  return user;
};



const createCoupon = async (payload: ICoupon, email: string) => {
  await ensureAdminOrSender(email);

  const isCodeExists = await Coupon.findOne({ code: payload.code });
  if (isCodeExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Coupon code already exists");
  }

  return await Coupon.create(payload);
};


const getAllCoupons = async (email: string) => {
  await ensureAdminOrSender(email);
  return await Coupon.find().sort({ expiryDate: 1 });
};


const getSingleCoupon = async (id: string, email: string) => {
  await ensureAdminOrSender(email);

  const coupon = await Coupon.findById(id);
  if (!coupon) {
    throw new AppError(StatusCodes.NOT_FOUND, "Coupon not found");
  }
  return coupon;
};


const updateCoupon = async (id: string, data: Partial<ICoupon>, email: string) => {
  await ensureAdminOrSender(email);

  const updated = await Coupon.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!updated) {
    throw new AppError(StatusCodes.NOT_FOUND, "Coupon not found");
  }
  return updated;
};


const deleteCoupon = async (id: string, email: string) => {
  await ensureAdminOrSender(email);

  const deleted = await Coupon.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "Coupon not found");
  }
  return deleted;
};

export const CouponService = {
    createCoupon,
    getAllCoupons,
    getSingleCoupon,
    updateCoupon,
    deleteCoupon
} 