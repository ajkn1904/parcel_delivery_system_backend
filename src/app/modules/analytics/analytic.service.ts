import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { ParcelStatus } from "../parcel/parcel.interface";
import { Parcel } from "../parcel/parcel.model";
import { User } from "../user/user.model";


// Delivery Status Distribution
const getDeliveryStatusDistribution = async (email: string) => {

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  const filter = user.role === "admin" ? {} : { sender: user._id };

  const result = await Parcel.aggregate([
    { $match: filter },
    {
      $group: {
        _id: "$currentStatus",
        count: { $sum: 1 },
      },
    },
    { $project: { status: "$_id", count: 1, _id: 0 } },
  ]);
  return result;
};

// Monthly Shipments (number of parcels created per month)
const getMonthlyShipments = async (email: string) => {

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  const filter = user.role === "admin" ? {} : { sender: user._id };
  
  const result = await Parcel.aggregate([
    { $match: filter },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id": 1 } },
   // { $project: { month: "$_id", count: 1, _id: 0 } },
  ]);
  return result;
};

// Parcel Trends (delivered vs canceled vs delivered) for current month
const getParcelTrends = async (email: string) => {
      
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  const filter = user.role === "admin" ? {} : { sender: user._id };
  const startOfMonth = new Date(1);
  const endOfMonth = new Date();

  const result = await Parcel.aggregate([
    { $match: filter },
    { $match: {
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }}
    },
    {
      $match: {
        currentStatus: { $in: [ParcelStatus.Delivered, ParcelStatus.Canceled, ParcelStatus.Returned] }
      }
    },
    {
      $group: {
        _id: {
          month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          status: "$currentStatus"
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.month": 1 } },
    {
      $project: {
        month: "$_id.month",
        status: "$_id.status",
        count: 1,
        _id: 0
      }
    }
  ]);
  return result;
};


export const ParcelAnalyticsService = {
    getDeliveryStatusDistribution,
    getMonthlyShipments,
    getParcelTrends
};