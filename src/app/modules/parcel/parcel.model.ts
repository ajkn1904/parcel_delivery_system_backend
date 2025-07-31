import { model, Schema, Types } from "mongoose";
import { DeliveryMethod, IParcel, IStatusLog, ParcelStatus, ParcelType, PaymentMethod } from "./parcel.interface";

const StatusLogSchema = new Schema<IStatusLog>(
  {
    status: {
      type: String,
      enum: Object.values(ParcelStatus),
      required: true
    },
    location: { type: String },
    note: { type: String },
    updatedBy: { type: Types.ObjectId, ref: "User" }
  },
  { _id: false, timestamps: true } 
);

const ParcelSchema = new Schema<IParcel>(
  {
    sender: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    receiver: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },

    trackingId: { 
        type: String, 
        unique: true, 
        required: true 
    },

    parcelType: {
      type: String,
      enum: Object.values(ParcelType),
      required: true
    },

    weight: { 
        type: Number, 
        required: true 
    },
    deliveryMethod: {
      type: String,
      enum: Object.values(DeliveryMethod),
      required: true
    },

    deliveryAddress: { 
        type: String, 
        required: true 
    },
    pickupAddress: { 
        type: String, 
        required: true 
    },
    contactPhone: { 
        type: String, 
        required: true 
    },

    currentStatus: {
      type: String,
      enum: Object.values(ParcelStatus),
      default: ParcelStatus.Requested
    },

    trackingEvents: {
      type: [StatusLogSchema],
      default: []
    },

    estimatedDeliveryDate: { 
        type: Date, 
        required: true 
    },
    deliveryFee: { 
        type: Number, 
        required: true 
    },

    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true
    },

    isPaid: { type: Boolean },
    isCancelled: { type: Boolean }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const Parcel = model<IParcel>("Parcel", ParcelSchema);