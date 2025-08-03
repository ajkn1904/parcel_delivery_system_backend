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
exports.CouponController = exports.deleteCoupon = exports.updateCoupon = exports.getSingleCoupon = exports.getAllCoupons = exports.createCoupon = void 0;
const catchAsync_1 = require("../../../utils/catchAsync");
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const coupon_service_1 = require("./coupon.service");
exports.createCoupon = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.user.email;
    const coupon = yield coupon_service_1.CouponService.createCoupon(req.body, email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "Coupon Created Successfully",
        data: coupon,
    });
}));
exports.getAllCoupons = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.user.email;
    const coupons = yield coupon_service_1.CouponService.getAllCoupons(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Coupons Retrieved Successfully",
        data: coupons,
    });
}));
exports.getSingleCoupon = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.user.email;
    const id = req.params.id;
    const coupon = yield coupon_service_1.CouponService.getSingleCoupon(id, email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Coupon Retrieved Successfully",
        data: coupon,
    });
}));
exports.updateCoupon = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.user.email;
    const id = req.params.id;
    const updatedCoupon = yield coupon_service_1.CouponService.updateCoupon(id, req.body, email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Coupon Updated Successfully",
        data: updatedCoupon,
    });
}));
exports.deleteCoupon = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.user.email;
    const id = req.params.id;
    yield coupon_service_1.CouponService.deleteCoupon(id, email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Coupon Deleted Successfully",
        data: null,
    });
}));
exports.CouponController = {
    createCoupon: exports.createCoupon,
    getAllCoupons: exports.getAllCoupons,
    getSingleCoupon: exports.getSingleCoupon,
    updateCoupon: exports.updateCoupon,
    deleteCoupon: exports.deleteCoupon
};
