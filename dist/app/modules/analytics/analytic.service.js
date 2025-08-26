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
exports.ParcelAnalyticsService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const parcel_interface_1 = require("../parcel/parcel.interface");
const parcel_model_1 = require("../parcel/parcel.model");
const user_model_1 = require("../user/user.model");
// Delivery Status Distribution
const getDeliveryStatusDistribution = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    const filter = user.role === "admin" ? {} : { sender: user._id };
    const result = yield parcel_model_1.Parcel.aggregate([
        { $match: filter },
        {
            $group: {
                _id: "$currentStatus",
                count: { $sum: 1 },
            },
        },
        { $project: { status: "$_id", count: 1, _id: 0 } },
    ]);
    return result;
});
// Monthly Shipments (number of parcels created per month)
const getMonthlyShipments = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    const filter = user.role === "admin" ? {} : { sender: user._id };
    const result = yield parcel_model_1.Parcel.aggregate([
        { $match: filter },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                count: { $sum: 1 },
            },
        },
        { $sort: { "_id": 1 } },
        // { $project: { month: "$_id", count: 1, _id: 0 } },
    ]);
    return result;
});
// Parcel Trends (delivered vs canceled vs delivered) for current month
const getParcelTrends = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    const filter = user.role === "admin" ? {} : { sender: user._id };
    const startOfMonth = new Date(1);
    const endOfMonth = new Date();
    const result = yield parcel_model_1.Parcel.aggregate([
        { $match: filter },
        { $match: {
                createdAt: { $gte: startOfMonth, $lte: endOfMonth }
            }
        },
        {
            $match: {
                currentStatus: { $in: [parcel_interface_1.ParcelStatus.Delivered, parcel_interface_1.ParcelStatus.Canceled, parcel_interface_1.ParcelStatus.Returned] }
            }
        },
        {
            $group: {
                _id: {
                    month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    status: "$currentStatus"
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.month": 1 } },
        {
            $project: {
                month: "$_id.month",
                status: "$_id.status",
                count: 1,
                _id: 0
            }
        }
    ]);
    return result;
});
exports.ParcelAnalyticsService = {
    getDeliveryStatusDistribution,
    getMonthlyShipments,
    getParcelTrends
};
