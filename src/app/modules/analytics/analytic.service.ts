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

  //const filter = user.role === "admin" ? {} : { sender: user._id };
  let filter: Record<string, string> = {};

  if (user.role === "sender") {
    filter = { sender: user._id };
  } else if (user.role === "receiver") {
    filter = { receiver: user._id };
  } 


  // Get current year range
  const startOfYear = new Date(new Date().getFullYear(), 0, 1); 
  const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);

  const result = await Parcel.aggregate([
    {
      $match: {
        ...filter,
        createdAt: { $gte: startOfYear, $lt: endOfYear },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id": 1 } },
    // { $project: { month: "$_id", count: 1, _id: 0 } }, // uncomment if you want clean output
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
   const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(endDate.getMonth() - 2); 
  startDate.setDate(1); 
  startDate.setHours(0, 0, 0, 0); 

  const result = await Parcel.aggregate([
    { $match: filter },
    { $match: {
        createdAt: { $gte: startDate, $lte: endDate }}
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


const getOverviewData = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const filter = user.role === "admin" ? {} : { sender: user._id };

  const result = await Parcel.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        delivered: {
          $sum: { $cond: [{ $eq: ["$currentStatus", ParcelStatus.Delivered] }, 1, 0] }
        },
        inTransit: {
          $sum: { $cond: [{ $eq: ["$currentStatus", ParcelStatus.InTransit] }, 1, 0] }
        },
        pending: {
          $sum: { $cond: [{ $eq: ["$currentStatus", ParcelStatus.Requested] }, 1, 0] }
        },
        canceled: {
          $sum: { $cond: [{ $eq: ["$currentStatus", ParcelStatus.Canceled] }, 1, 0] }
        },
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
        delivered: 1,
        inTransit: 1,
        pending: 1,
        canceled: 1,
      },
    },
  ]);

  return result[0] || { total: 0, delivered: 0, inTransit: 0, pending: 0, canceled: 0 };
};


//for receiver
// Success Metrics
const getReceiverSuccessMetrics = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const result = await Parcel.aggregate([
    { $match: { receiver: user._id } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        delivered: {
          $sum: { $cond: [{ $eq: ["$currentStatus", ParcelStatus.Delivered] }, 1, 0] }
        },
        canceled: {
          $sum: { $cond: [{ $eq: ["$currentStatus", ParcelStatus.Canceled] }, 1, 0] }
        },
        returned: {
          $sum: { $cond: [{ $eq: ["$currentStatus", ParcelStatus.Returned] }, 1, 0] }
        },
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
        delivered: 1,
        canceled: 1,
        returned: 1,
      },
    },
  ]);

  return result[0] || { total: 0, delivered: 0, canceled: 0, returned: 0 };
};

// Delivery Performance
const getReceiverDeliveryPerformance = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  // Current year range
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);

  const monthlyPerformance = await Parcel.aggregate([
    { $match: { receiver: user._id, currentStatus: ParcelStatus.Delivered } },
    {
      $addFields: {
        deliveredEvents: {
          $filter: {
            input: "$trackingEvents",
            as: "ev",
            cond: { $eq: ["$$ev.status", ParcelStatus.Delivered] },
          },
        },
      },
    },
    {
      $addFields: {
        deliveredAt: {
          $let: {
            vars: { last: { $arrayElemAt: ["$deliveredEvents", -1] } },
            in: { $ifNull: ["$$last.createdAt", "$updatedAt"] },
          },
        },
      },
    },
    { $match: { deliveredAt: { $gte: startOfYear, $lt: endOfYear } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$deliveredAt" } },
        onTime: {
          $sum: {
            $cond: [
              { $lte: ["$deliveredAt", "$estimatedDeliveryDate"] },
              1,
              0,
            ],
          },
        },
        late: {
          $sum: {
            $cond: [
              { $gt: ["$deliveredAt", "$estimatedDeliveryDate"] },
              1,
              0,
            ],
          },
        },
        totalDelivered: { $sum: 1 },
      },
    },
    { $sort: { "_id": 1 } },
    {
      $project: {
        month: "$_id",
        onTime: 1,
        late: 1,
        _id: 0,
      },
    },
  ]);

  const totalDelivered = monthlyPerformance.reduce((sum, m) => sum + m.onTime + m.late, 0);

  return [
      {
        total: totalDelivered,
        performance: monthlyPerformance,
      },
    ];
};



export const ParcelAnalyticsService = {
    getDeliveryStatusDistribution,
    getMonthlyShipments,
    getParcelTrends,
    getOverviewData,
    getReceiverDeliveryPerformance,
    getReceiverSuccessMetrics
};