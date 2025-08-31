"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryMethod = exports.PaymentMethod = exports.ParcelStatus = exports.ParcelType = void 0;
var ParcelType;
(function (ParcelType) {
    ParcelType["Documents"] = "Documents";
    ParcelType["Electronics"] = "Electronics";
    ParcelType["Clothing"] = "Clothing";
    ParcelType["Grocery"] = "Grocery";
    ParcelType["Other"] = "Other";
})(ParcelType || (exports.ParcelType = ParcelType = {}));
var ParcelStatus;
(function (ParcelStatus) {
    ParcelStatus["Requested"] = "Requested";
    ParcelStatus["Approved"] = "Approved";
    ParcelStatus["Dispatched"] = "Dispatched";
    ParcelStatus["InTransit"] = "In Transit";
    ParcelStatus["Delivered"] = "Delivered";
    ParcelStatus["Canceled"] = "Canceled";
    ParcelStatus["Blocked"] = "Blocked";
    ParcelStatus["Unblocked"] = "Unblocked";
    ParcelStatus["Returned"] = "Returned";
})(ParcelStatus || (exports.ParcelStatus = ParcelStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CashOnDelivery"] = "Cash on Delivery";
    PaymentMethod["OnlinePayment"] = "Online Payment";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var DeliveryMethod;
(function (DeliveryMethod) {
    DeliveryMethod["Agent"] = "Agent";
    DeliveryMethod["Hub"] = "Hub";
})(DeliveryMethod || (exports.DeliveryMethod = DeliveryMethod = {}));
