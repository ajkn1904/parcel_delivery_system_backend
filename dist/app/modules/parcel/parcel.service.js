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
exports.ParcelService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const parcel_interface_1 = require("./parcel.interface");
const parcel_model_1 = require("./parcel.model");
const user_model_1 = require("../user/user.model");
const queryBuilder_1 = require("../../utils/queryBuilder");
const parcel_constants_1 = require("./parcel.constants");
const getTrackingId = () => {
    return `TRK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10000 + Math.random() * 1000)}`;
};
const getDeliveryFee = (weight, distanceKm) => {
    if (weight < 2) {
        return 50;
    }
    else {
        return 50 + (.75 * distanceKm);
    }
};
const createParcel = (payload, email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    if (user.role !== 'sender') {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Only sender can create a parcel");
    }
    ;
    const isTrackingIdExists = yield parcel_model_1.Parcel.findOne({ trackingId: payload.trackingId });
    if (isTrackingIdExists) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Tracking ID already exists!");
    }
    const trackingId = getTrackingId();
    const deliveryFee = getDeliveryFee(payload.weight, payload.deliveryDistance || 0);
    const hasCoupon = !!payload.coupon;
    if (hasCoupon) {
        const coupon = yield parcel_model_1.Coupon.findById(payload.coupon);
        if (!coupon) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid coupon");
        }
        if (new Date(coupon.expiryDate) < new Date()) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Coupon has expired");
        }
        const discountAmount = Math.round((deliveryFee * coupon.discountPercentage) / 100);
        const afterDiscountDeliveryFee = deliveryFee - discountAmount;
        payload.discountAmount = `${discountAmount} tk`;
        payload.afterDiscountDeliveryFee = afterDiscountDeliveryFee;
    }
    const parcelPayload = Object.assign(Object.assign({}, payload), { sender: user._id, trackingId: trackingId, deliveryFee: Number(deliveryFee) });
    const newParcel = yield parcel_model_1.Parcel.create(parcelPayload);
    return newParcel;
});
// const getAllParcels = async (email: string, query: Record<string, string>) => {
//     const user = await User.findOne({ email: email });
//     if (!user) {            
//         throw new AppError(StatusCodes.NOT_FOUND, "User not found");
//     }
//     if(user.role === "admin"){
//         //return await Parcel.find();
//         const queryBuilder = new QueryBuilder(Parcel.find(), query)
//         const parcels = await queryBuilder.search(parcelSearchableFields).filter().sort().fields().paginate()
//         const [data, meta] = await Promise.all([
//             parcels.build(),
//             queryBuilder.getMeta()
//         ])
//             return {
//             data,
//             meta
//         };
//     }
//     if(user.role === "sender") {
//         //return await Parcel.find({ sender: user._id });
//         const queryBuilder = new QueryBuilder(Parcel.find({ sender: user._id }), query)
//         const parcel = await queryBuilder.search(parcelSearchableFields).filter().sort().fields().paginate()
//         const [data, meta] = await Promise.all([
//             parcel.build(),
//             queryBuilder.getMeta()
//         ])
//             return {
//             data,
//             meta
//         };
//     }
//     if(user.role === "receiver") {
//         //return await Parcel.find({ receiver: user._id });
//         const queryBuilder = new QueryBuilder(Parcel.find({ receiver: user._id }), query)
//         const parcel = await queryBuilder.search(parcelSearchableFields).filter().sort().fields().paginate()
//         const [data, meta] = await Promise.all([
//             parcel.build(),
//             queryBuilder.getMeta()
//         ])
//             return {
//             data,
//             meta
//         };
//     }
//     return [];
// }
const getAllParcels = (email, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    // eslint-disable-next-line prefer-const
    let filter = {};
    if (user.role === "sender") {
        filter.sender = user._id;
    }
    else if (user.role === "receiver") {
        filter.receiver = user._id;
    }
    else if (user.role !== "admin") {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "User role is not permitted to view parcels");
    }
    //const queryBuilder = new QueryBuilder(Parcel.find(filter), queryParams);
    const queryBuilder = new queryBuilder_1.QueryBuilder(parcel_model_1.Parcel.find(filter).populate('sender', 'email').populate('receiver', 'email'), queryParams);
    const queryChain = yield queryBuilder
        .search(parcel_constants_1.parcelSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        queryChain.build(),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
});
const getSingleParcel = (id, email, decodedRole) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const user = yield user_model_1.User.findOne({ email: email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    const parcel = yield parcel_model_1.Parcel.findById(id);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Parcel not found");
    }
    if (decodedRole === "admin") {
        return parcel;
    }
    else if (decodedRole === "sender" && ((_a = parcel.sender) === null || _a === void 0 ? void 0 : _a.toString()) === user._id.toString()) {
        return parcel;
    }
    else if (decodedRole === "receiver" && ((_b = parcel.receiver) === null || _b === void 0 ? void 0 : _b.toString()) === user._id.toString()) {
        return parcel;
    }
    else
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You are not authorized to access this parcel");
});
const updateParcelStatus = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const parcel = yield parcel_model_1.Parcel.findById(id);
    const user = yield user_model_1.User.findOne({ email: email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Parcel not found");
    }
    //sender can 'cancel' parcel
    if (user.role === "sender") {
        if (((_a = parcel.sender) === null || _a === void 0 ? void 0 : _a.toString()) !== user._id.toString()) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You are not authorized to update this parcel");
        }
        if (parcel.currentStatus !== 'Requested' && parcel.currentStatus !== 'Approved') {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Parcel already in dispatched or processed.");
        }
        parcel.currentStatus = parcel_interface_1.ParcelStatus.Canceled;
        parcel.isCancelled = true;
        parcel.trackingEvents.push({
            status: parcel_interface_1.ParcelStatus.Canceled,
            note: "Parcel has been canceled by sender.",
            updatedBy: user._id.toString(),
        });
    }
    //receiver can confirm 'delivery'
    else if (user.role === "receiver") {
        if (((_b = parcel.receiver) === null || _b === void 0 ? void 0 : _b.toString()) !== user._id.toString()) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You are not authorized to update this parcel");
        }
        if (parcel.currentStatus !== 'In Transit') {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Parcel is not in transit yet.");
        }
        parcel.currentStatus = parcel_interface_1.ParcelStatus.Delivered;
        parcel.isPaid = true;
        parcel.trackingEvents.push({
            status: parcel_interface_1.ParcelStatus.Delivered,
            note: "Parcel is received & status updated by receiver.",
            updatedBy: user._id.toString(),
        });
    }
    else {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Unauthorized access!");
    }
    yield parcel.save();
    return parcel;
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateParcelStatusByAdmin = (payload, id, email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    if (user.role !== "admin") {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Only admin can update parcel status");
    }
    const parcel = yield parcel_model_1.Parcel.findById(id);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Parcel not found");
    }
    parcel.currentStatus = payload.currentStatus;
    if (payload.currentStatus === parcel_interface_1.ParcelStatus.Canceled) {
        parcel.isCancelled = true;
    }
    else if (payload.currentStatus === parcel_interface_1.ParcelStatus.Delivered) {
        parcel.isPaid = true;
    }
    else if (payload.currentStatus === parcel_interface_1.ParcelStatus.Returned) {
        parcel.isPaid = false;
    }
    else if (payload.currentStatus === parcel_interface_1.ParcelStatus.Blocked) {
        parcel.isBlocked = true;
        parcel.isCancelled = true;
    }
    if (!payload.currentStatus) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Current status is required.");
    }
    parcel.trackingEvents.push({
        status: payload.currentStatus === "Blocked" ? "Canceled" : payload.currentStatus,
        note: `Parcel status updated to ${payload.currentStatus === "Blocked" ? "Canceled" : payload.currentStatus} by admin.`,
        location: payload.location || "N/A",
        updatedBy: user._id.toString(),
    });
    yield parcel.save();
    return parcel;
});
const deleteParcel = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    if (user.role !== "admin") {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Only admin can delete parcel");
    }
    const parcel = yield parcel_model_1.Parcel.findById(id);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Parcel not found");
    }
    yield parcel_model_1.Parcel.findByIdAndDelete(id);
    return { message: "Parcel deleted successfully" };
});
const trackParcel = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const user = yield user_model_1.User.findOne({ email: email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    const parcel = yield parcel_model_1.Parcel.findById(id);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Parcel not found");
    }
    if (user.role === "admin") {
        return parcel.trackingEvents;
    }
    else if (user.role === "sender" && ((_a = parcel.sender) === null || _a === void 0 ? void 0 : _a.toString()) === user._id.toString()) {
        return parcel.trackingEvents;
    }
    else if (user.role === "receiver" && ((_b = parcel.receiver) === null || _b === void 0 ? void 0 : _b.toString()) === user._id.toString()) {
        return parcel.trackingEvents;
    }
    else
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You are not authorized to access this parcel");
});
exports.ParcelService = {
    createParcel,
    getAllParcels,
    getSingleParcel,
    updateParcelStatus,
    updateParcelStatusByAdmin,
    deleteParcel,
    trackParcel
};
