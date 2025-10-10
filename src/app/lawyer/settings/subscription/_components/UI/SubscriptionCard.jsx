import React from "react";
import dayjs from "dayjs";

const SubscriptionCard = ({ subscription }) => {
    const { subscriptionPackageId, status, subscriptionPeriodStart, subscriptionPeriodEnd, autoRenew } = subscription;

    return (
        <div className=" bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{subscriptionPackageId.name}</h2>
                <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                >
                    {status.toUpperCase()}
                </span>
            </div>

            <div className="mb-4">
                <p className="text-gray-600">
                    <span className="font-medium">Price:</span> {subscriptionPackageId.price.amount / 100}{" "}
                    {subscriptionPackageId.price.currency.toUpperCase()} / {subscriptionPackageId.billingCycle}
                </p>
                <p className="text-gray-600">
                    <span className="font-medium">Period:</span>{" "}
                    {dayjs(subscriptionPeriodStart).format("DD MMM YYYY")} - {dayjs(subscriptionPeriodEnd).format("DD MMM YYYY")}
                </p>
                <p className="text-gray-600">
                    <span className="font-medium">Auto Renew:</span> {autoRenew ? "Yes" : "No"}
                </p>
            </div>

           
        </div>
    );
};

export default SubscriptionCard;
