import { Document, Types } from "mongoose";

export enum ParcelType {
  Documents = "Documents",
  Electronics = "Electronics",
  Clothing = "Clothing",
  Grocery = "Grocery",
  Other = "Other"
}

export enum ParcelStatus {
  Requested = "Requested",
  Approved = "Approved",
  Dispatched = "Dispatched",
  InTransit = "In Transit",
  Delivered = "Delivered",
  Canceled = "Canceled",
  Blocked = "Blocked",
  Returned = "Returned"
}

export enum PaymentMethod {
  CashOnDelivery = "Cash on Delivery",
  OnlinePayment = "Online Payment"
}

export enum DeliveryMethod {
  Agent = "Agent",
  Hub = "Hub"
}

export interface IStatusLog {
  status: ParcelStatus;
  location?: string;
  note?: string;
  updatedBy?: string; // user id
}



export interface IParcel extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  trackingId: string;
  parcelType: ParcelType;
  weight: number;
  deliveryMethod: DeliveryMethod;
  deliveryAddress: string;
  pickupAddress: string;
  contactPhone: string;

  currentStatus?: ParcelStatus;             
  trackingEvents: IStatusLog[];            

  estimatedDeliveryDate: Date;
  deliveryFee: number;
  paymentMethod: PaymentMethod;
  isPaid?: boolean;
  isCancelled?: boolean;
}

