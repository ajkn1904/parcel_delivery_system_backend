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
exports.ParcelAnalyticsController = void 0;
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = require("../../utils/catchAsync");
const analytic_service_1 = require("./analytic.service");
const getDeliveryStatusDistribution = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user.email;
    const result = yield analytic_service_1.ParcelAnalyticsService.getDeliveryStatusDistribution(user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Delivery status distribution retrieved successfully",
        data: result,
    });
}));
const getMonthlyShipments = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user.email;
    const result = yield analytic_service_1.ParcelAnalyticsService.getMonthlyShipments(user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Monthly shipments retrieved successfully",
        data: result,
    });
}));
const getParcelTrends = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user.email;
    const result = yield analytic_service_1.ParcelAnalyticsService.getParcelTrends(user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Parcel trends retrieved successfully",
        data: result,
    });
}));
exports.ParcelAnalyticsController = {
    getDeliveryStatusDistribution,
    getMonthlyShipments,
    getParcelTrends
};
