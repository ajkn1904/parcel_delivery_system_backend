import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { IParcel } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import { User } from "../user/user.model";


const getTrackingId = () => {
    return `TRK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10000 + Math.random() * 1000)}`
}

const getDeliveryFee = (weight: number, distanceKm: number): number => {
  if (weight < 2) {
    return 50;
  } else {
    return 50 + (10 * distanceKm);
  }
}

const applyCouponDiscount = (deliveryFee: number, hasCoupon: boolean) : { discountAmount: number; afterDiscountFee: number; } => {
  if (hasCoupon) {
    const discountAmount = Math.round(deliveryFee * 0.15);
    const afterDiscountFee = deliveryFee - discountAmount;
    return { discountAmount, afterDiscountFee };
  }
  return {
     discountAmount: 0, 
     afterDiscountFee: deliveryFee 
    };
}


const createParcel = async (payload: IParcel, email:string) => {

    const user = await User.findOne({email: email});
    if(!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    if(user.role !== 'sender') {
        throw new AppError(StatusCodes.FORBIDDEN, "Only sender can create a parcel");
    };
    const isTrackingIdExists = await Parcel.findOne({ trackingId: payload.trackingId });
    if( isTrackingIdExists) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Tracking ID already exists!");
    }

    const trackingId = getTrackingId();
    
    const hasCoupon = !!payload.coupon;
    if(hasCoupon){
        const { discountAmount,afterDiscountFee } = applyCouponDiscount(payload.deliveryFee, hasCoupon);
        payload.discountAmount = discountAmount;
        payload.afterDiscountFee = afterDiscountFee;
    }    
    const deliveryFee = getDeliveryFee(payload.weight, payload.deliveryDistance || 0);
    
    
    const parcelPayload = {
        ...payload,
        sender: user._id,
        trackingId: trackingId,
        deliveryFee: deliveryFee,
    }

    const newParcel = await Parcel.create(parcelPayload);
    return newParcel;
}

const getAllParcels = async (email: string) => {
    const user = await User.findOne({ email: email });
    if (!user) {            
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    if(user.role === "admin"){
        return await Parcel.find();
    }
    if(user.role === "sender") {
        return await Parcel.find({ sender: user._id });
    }
    if(user.role === "receiver") {
        return await Parcel.find({ receiver: user._id });
    }

    return [];
}


const getSingleParcel = async (id: string, email: string, decodedRole: string) => {
    const user = await User.findOne({ email: email });
    if (!user) {            
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    const parcel = await Parcel.findById(id);
    if (!parcel) {
        throw new AppError(StatusCodes.NOT_FOUND, "Parcel not found");
    }

    if(decodedRole === "admin") {
        return parcel;
    }
    else if(decodedRole === "sender" && parcel.sender?.toString() === user._id.toString()) {
        return parcel;
    }
    else if(decodedRole === "receiver" && parcel.receiver?.toString() === user._id.toString()) {
        return parcel;
    }
    else throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized to access this parcel");
}


export const ParcelService = {
    createParcel,
    getAllParcels,
    getSingleParcel
}