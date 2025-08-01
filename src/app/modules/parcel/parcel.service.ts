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


export const ParcelService = {
    createParcel,
}