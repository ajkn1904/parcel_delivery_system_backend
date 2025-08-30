"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = exports.Coupon = void 0;
const mongoose_1 = require("mongoose");
const parcel_interface_1 = require("./parcel.interface");
const StatusLogSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.ParcelStatus),
        default: parcel_interface_1.ParcelStatus.Requested,
    },
    location: { type: String },
    note: { type: String },
    updatedBy: { type: mongoose_1.Types.ObjectId, ref: "User" },
    updatedByRole: { type: String }
}, { _id: false, timestamps: true });
const couponSchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Coupon = (0, mongoose_1.model)("Coupon", couponSchema);
const ParcelSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    trackingId: {
        type: String,
        unique: true,
        required: true,
    },
    parcelType: {
        type: String,
        enum: Object.values(parcel_interface_1.ParcelType),
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    deliveryMethod: {
        type: String,
        enum: Object.values(parcel_interface_1.DeliveryMethod),
        required: true,
    },
    deliveryAddress: {
        type: String,
        required: true,
    },
    pickupAddress: {
        type: String,
        required: true,
    },
    deliveryDistance: {
        type: Number,
        required: true,
    },
    contactPhone: {
        type: String,
        required: true,
    },
    currentStatus: {
        type: String,
        enum: Object.values(parcel_interface_1.ParcelStatus),
        default: parcel_interface_1.ParcelStatus.Requested,
    },
    trackingEvents: {
        type: [StatusLogSchema],
        default: () => [{
                status: parcel_interface_1.ParcelStatus.Requested,
                note: undefined,
                location: undefined,
            }],
    },
    estimatedDeliveryDate: {
        type: Date,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: Object.values(parcel_interface_1.PaymentMethod),
        required: true,
    },
    coupon: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Coupon",
        required: false,
    },
    discountAmount: {
        type: String,
        default: "0 tk",
    },
    deliveryFee: {
        type: Number,
        required: true,
    },
    afterDiscountDeliveryFee: {
        type: Number,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    isCancelled: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Parcel = (0, mongoose_1.model)("Parcel", ParcelSchema);
