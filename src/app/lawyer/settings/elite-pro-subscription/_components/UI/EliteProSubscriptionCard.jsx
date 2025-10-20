import React from 'react';
import dayjs from 'dayjs';

const EliteProSubscriptionCard = ({ subscription }) => {
  const {
    eliteProPackageId,
    status,
    eliteProPeriodStart,
    eliteProPeriodEnd,
    autoRenew,
  } = subscription;

  return (
    <div className=" bg-white rounded-xl overflow-hidden border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {eliteProPackageId?.name}
        </h2>
        <span
          className={`px-3 py-1 text-sm font-medium rounded-full ${
            status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {status?.toUpperCase()}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-gray-600">
          <span className="font-medium">Price:</span>{' '}
          {eliteProPackageId?.price.amount / 100}{' '}
          {eliteProPackageId?.price.currency.toUpperCase()} /{' '}
          {eliteProPackageId?.billingCycle}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Period:</span>{' '}
          {dayjs(eliteProPeriodStart).format('DD MMM YYYY')} -{' '}
          {dayjs(eliteProPeriodEnd).format('DD MMM YYYY')}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Auto Renew:</span>{' '}
          {autoRenew ? 'Yes' : 'No'}
        </p>
      </div>
    </div>
  );
};

export default EliteProSubscriptionCard;
