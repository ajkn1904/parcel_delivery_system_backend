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
exports.ParcelController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const parcel_service_1 = require("./parcel.service");
const createParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const parcel = yield parcel_service_1.ParcelService.createParcel(req.body, user.email);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Parcel Created Successfully",
        data: parcel,
    });
}));
const getAllParcels = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const query = req.query;
    const parcel = yield parcel_service_1.ParcelService.getAllParcels(user.email, query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Parcel Retrieved Successfully",
        data: parcel.data,
        meta: parcel.meta
    });
}));
const getSingleParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const parcelId = req.params.id;
    const parcel = yield parcel_service_1.ParcelService.getSingleParcel(parcelId, user.email, user.role);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Parcel Retrieved Successfully",
        data: parcel,
    });
}));
const updateParcelStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const parcelId = req.params.id;
    const parcel = yield parcel_service_1.ParcelService.updateParcelStatus(parcelId, user.email);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Parcel Updated Successfully",
        data: parcel,
    });
}));
const updateParcelStatusByAdmin = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const parcelId = req.params.id;
    const parcel = yield parcel_service_1.ParcelService.updateParcelStatusByAdmin(req.body, parcelId, user.email);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Parcel Updated Successfully",
        data: parcel,
    });
}));
const deleteParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.user.email;
    const parcelId = req.params.id;
    yield parcel_service_1.ParcelService.deleteParcel(parcelId, email);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Parcel Deleted Successfully",
        data: null
    });
}));
const trackParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.user.email;
    const parcelId = req.params.id;
    const parcel = yield parcel_service_1.ParcelService.trackParcel(parcelId, email);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Parcel Retrieved Successfully",
        data: parcel
    });
}));
exports.ParcelController = {
    createParcel,
    getAllParcels,
    getSingleParcel,
    updateParcelStatus,
    updateParcelStatusByAdmin,
    deleteParcel,
    trackParcel
};
