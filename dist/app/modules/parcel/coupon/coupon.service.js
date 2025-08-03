"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponService = void 0;
const http_status_codes_1 = require("http-status-codes");
const parcel_model_1 = require("../parcel.model");
const AppError_1 = __importDefault(require("../../../errorHelper/AppError"));
const user_model_1 = require("../../user/user.model");
const ensureAdminOrSender = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    if (user.role !== "admin" && user.role !== "sender") {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Only admin or sender can manage coupons");
    }
    return user;
});
const createCoupon = (payload, email) => __awaiter(void 0, void 0, void 0, function* () {
    yield ensureAdminOrSender(email);
    const isCodeExists = yield parcel_model_1.Coupon.findOne({ code: payload.code });
    if (isCodeExists) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Coupon code already exists");
    }
    return yield parcel_model_1.Coupon.create(payload);
});
const getAllCoupons = (email) => __awaiter(void 0, void 0, void 0, function* () {
    yield ensureAdminOrSender(email);
    return yield parcel_model_1.Coupon.find().sort({ expiryDate: 1 });
});
const getSingleCoupon = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    yield ensureAdminOrSender(email);
    const coupon = yield parcel_model_1.Coupon.findById(id);
    if (!coupon) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Coupon not found");
    }
    return coupon;
});
const updateCoupon = (id, data, email) => __awaiter(void 0, void 0, void 0, function* () {
    yield ensureAdminOrSender(email);
    const updated = yield parcel_model_1.Coupon.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Coupon not found");
    }
    return updated;
});
const deleteCoupon = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    yield ensureAdminOrSender(email);
    const deleted = yield parcel_model_1.Coupon.findByIdAndDelete(id);
    if (!deleted) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Coupon not found");
    }
    return deleted;
});
exports.CouponService = {
    createCoupon,
    getAllCoupons,
    getSingleCoupon,
    updateCoupon,
    deleteCoupon
};
