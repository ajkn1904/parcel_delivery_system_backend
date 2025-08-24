import { ParcelStatus } from "../parcel/parcel.interface";
import { Parcel } from "../parcel/parcel.model";


// 📊 Delivery Status Distribution
const getDeliveryStatusDistribution = async () => {
  const result = await Parcel.aggregate([
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

// 📅 Monthly Shipments (number of parcels created per month)
const getMonthlyShipments = async () => {
  const result = await Parcel.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id": 1 } },
    { $project: { month: "$_id", count: 1, _id: 0 } },
  ]);
  return result;
};

// 📈 Parcel Trends (delivered vs canceled vs in-transit)
const getParcelTrends = async () => {
  const result = await Parcel.aggregate([
    {
      $match: {
        currentStatus: { $in: [ParcelStatus.Delivered, ParcelStatus.Canceled, ParcelStatus.InTransit] }
      }
    },
    {
      $group: {
        _id: {
          month: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
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