import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { IParcel, ParcelStatus } from "./parcel.interface";
import { Coupon, Parcel } from "./parcel.model";
import { User } from "../user/user.model";
import { QueryBuilder } from "../../utils/queryBuilder";
import { parcelSearchableFields } from "./parcel.constants";


const getTrackingId = () => {
    return `TRK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10000 + Math.random() * 1000)}`
}

const getDeliveryFee = (weight: number, distanceKm: number): number => {
  if (weight < 2) {
    return 50;
  } else {
    return 50 + (.75 * distanceKm);
  }
}


const createParcel = async (payload: IParcel, email:string) => {

    const user = await User.findOne({email: email});
    if(!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    if(user.role !== 'sender') {
        throw new AppError(StatusCodes.FORBIDDEN, "Only sender can create a parcel");
    };
    const isTrackingIdExists = await Parcel.findOne({ 
        trackingId: payload.trackingId });
    if( isTrackingIdExists) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Tracking ID already exists!");
    }

    const trackingId = getTrackingId();

    const deliveryFee = getDeliveryFee(payload.weight, payload.deliveryDistance || 0);
    
    
    const hasCoupon = !!payload.coupon;
    if(hasCoupon){
        const coupon = await Coupon.findById(payload.coupon);
        if (!coupon) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Invalid coupon");
        }
        
        if (new Date(coupon.expiryDate) < new Date()) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Coupon has expired");
        }
        
        
        const discountAmount = Math.round((deliveryFee * coupon.discountPercentage) / 100);
         const afterDiscountDeliveryFee = deliveryFee - discountAmount;

         payload.discountAmount =`${discountAmount} tk`;
         payload.afterDiscountDeliveryFee = afterDiscountDeliveryFee;
    }    
    
    
    const parcelPayload = {
        ...payload,
        sender: user._id,
        trackingId: trackingId,
        deliveryFee: Number(deliveryFee),
        trackingEvents: [
            {
            location: payload.pickupAddress,
            note: 'Parcel Request Created.',
            updatedBy: user._id,
            updatedByRole: user.role
            }
        ]
    }

    const newParcel = await Parcel.create(parcelPayload);
    return newParcel;
}

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

const getAllParcels = async (email: string, queryParams: Record<string, string>) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  // eslint-disable-next-line prefer-const
  let filter: Record<string, unknown> = {};

  if (user.role === "sender") {
    filter.sender = user._id;
  } else if (user.role === "receiver") {
    filter.receiver = user._id;
  } else if (user.role !== "admin") {
    throw new AppError(StatusCodes.FORBIDDEN, "User role is not permitted to view parcels");
  }

  //const queryBuilder = new QueryBuilder(Parcel.find(filter), queryParams);

  const queryBuilder = new QueryBuilder(Parcel.find(filter).populate('sender', 'email').populate('receiver', 'email'),  queryParams);

  const queryChain = await queryBuilder
    .search(parcelSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    queryChain.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};



const getSingleParcel = async (id: string, email: string, decodedRole: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    const parcel = await Parcel.findById(id)
        .populate("sender", "email")
        .populate("receiver", "email");
    if (!parcel) {
        throw new AppError(StatusCodes.NOT_FOUND, "Parcel not found");
    }

    if (decodedRole === "admin") {
        return parcel;
    }
    if (decodedRole === "sender" && parcel.sender?._id.toString() === user._id.toString()) {
        return parcel;
    }
    if (decodedRole === "receiver" && parcel.receiver?._id.toString() === user._id.toString()) {
        return parcel;
    }

    throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized to access this parcel");
};


const updateParcelStatus = async(id: string, email:string) => {
    const parcel = await Parcel.findById(id);
    
    const user = await User.findOne({ email: email });
    if (!user) {            
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }


    if (!parcel) {          
        throw new AppError(StatusCodes.NOT_FOUND, "Parcel not found");
    }

    //sender can 'cancel' parcel
    if(user.role === "sender"){
        if(parcel.sender?.toString() !== user._id.toString()) {
            throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized to update this parcel");
        }
        if(parcel.currentStatus !== 'Requested' && parcel.currentStatus !== 'Approved') {
            throw new AppError(StatusCodes.BAD_REQUEST, "Parcel already in dispatched or processed.");
        }
        parcel.currentStatus = ParcelStatus.Canceled;
        parcel.isCancelled = true;
        parcel.trackingEvents.push({
            status: ParcelStatus.Canceled,
            note: "Parcel has been canceled.",
            location: parcel.pickupAddress,
            updatedBy: user._id.toString(),
            updatedByRole: user.role,
        });        
    }

    //receiver can confirm 'delivery'
    else if(user.role === "receiver") {
        if(parcel.receiver?.toString() !== user._id.toString()) {
            throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized to update this parcel");
        }
        if(parcel.currentStatus !== 'In Transit') {
            throw new AppError(StatusCodes.BAD_REQUEST, "Parcel is not in transit yet.");
        }
        parcel.currentStatus = ParcelStatus.Delivered;
        parcel.isPaid = true;
        parcel.trackingEvents.push({
            status: ParcelStatus.Delivered,
            note: "Parcel is received.",
            location: parcel.deliveryAddress,
            updatedBy: user._id.toString(),
            updatedByRole: user.role,
        });
    }
    else {
        throw new AppError(StatusCodes.FORBIDDEN, "Unauthorized access!");
    } 

    await parcel.save();
    return parcel;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateParcelStatusByAdmin = async(payload: any, id: string, email:string) => {

    const user = await User.findOne({ email: email });
    if (!user) {            
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    if(user.role !== "admin") {
        throw new AppError(StatusCodes.FORBIDDEN, "Only admin can update parcel status");
    }


    const parcel = await Parcel.findById(id);
    if (!parcel) {
        throw new AppError(StatusCodes.NOT_FOUND, "Parcel not found");
    }

    parcel.currentStatus = payload.currentStatus;
    if (payload.currentStatus === ParcelStatus.Canceled) {
        parcel.isCancelled = true;
    } else if (payload.currentStatus === ParcelStatus.Delivered) {
        parcel.isPaid = true;
    } else if(payload.currentStatus === ParcelStatus.Returned){
        parcel.isPaid = false
    } else if(payload.currentStatus === ParcelStatus.Blocked){
        parcel.isBlocked =  true
        parcel.isCancelled = true
    } else if(payload.currentStatus === ParcelStatus.Unblocked){
        parcel.isBlocked =  false
        parcel.isCancelled = false
    }
    
    
    if (!payload.currentStatus) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Current status is required.");
    }


    parcel.trackingEvents.push({
        status: payload.currentStatus,
        note: payload.note ?? `Parcel status updated to ${payload.currentStatus}.`,
        location: payload.location,
        updatedBy: user._id.toString(),
        updatedByRole: user.role,
    });

    await parcel.save();
    return parcel;
}


const deleteParcel = async(id:string, email:string) => {
    
    const user = await User.findOne({ email: email });
    if (!user) {            
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    if(user.role !== "admin") {
        throw new AppError(StatusCodes.FORBIDDEN, "Only admin can delete parcel");
    }

    const parcel = await Parcel.findById(id);
    if (!parcel) {
        throw new AppError(StatusCodes.NOT_FOUND, "Parcel not found");
    }

    await Parcel.findByIdAndDelete(id)
    return { message: "Parcel deleted successfully" };

}


const trackParcel = async (id: string, email: string) => {
    const user = await User.findOne({ email: email });
    if (!user) {            
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    const parcel = await Parcel.findById(id);
    if (!parcel) {
        throw new AppError(StatusCodes.NOT_FOUND, "Parcel not found");
    }

    if(user.role === "admin") {
        return parcel.trackingEvents;
    }
    else if(user.role === "sender" && parcel.sender?.toString() === user._id.toString()) {
        return parcel.trackingEvents;
    }
    else if(user.role === "receiver" && parcel.receiver?.toString() === user._id.toString()) {
        return parcel.trackingEvents;
    }
    else throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized to access this parcel");
}



export const ParcelService = {
    createParcel,
    getAllParcels,
    getSingleParcel,
    updateParcelStatus,
    updateParcelStatusByAdmin,
    deleteParcel,
    trackParcel
}