import { model, Schema, Types } from "mongoose";
import {
  DeliveryMethod,
  ICoupon,
  IParcel,
  IStatusLog,
  ParcelStatus,
  ParcelType,
  PaymentMethod,
} from "./parcel.interface";

const StatusLogSchema = new Schema<IStatusLog>(
  {
    status: {
      type: String,
      enum: Object.values(ParcelStatus),
      default: ParcelStatus.Requested,
    },
    location: { type: String },
    note: { type: String },
    updatedBy: { type: Types.ObjectId, ref: "User" },
  },
  { _id: false, timestamps: true }
);


const couponSchema = new Schema<ICoupon>(
  {
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
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const Coupon = model<ICoupon>("Coupon", couponSchema);





const ParcelSchema = new Schema<IParcel>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: Schema.Types.ObjectId,
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
      enum: Object.values(ParcelType),
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },
    deliveryMethod: {
      type: String,
      enum: Object.values(DeliveryMethod),
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
      enum: Object.values(ParcelStatus),
      default: ParcelStatus.Requested,
    },

    trackingEvents: {
      type: [StatusLogSchema],
      default: () => [{ status: ParcelStatus.Requested }],
    },

    estimatedDeliveryDate: {
      type: Date,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    
    deliveryFee: {
      type: Number,
      required: true,
    },
    coupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      required: false,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    afterDiscountFee: {
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Parcel = model<IParcel>("Parcel", ParcelSchema);
