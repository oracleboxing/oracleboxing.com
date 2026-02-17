'use client';

import React from 'react';
import { CheckCircle, Mail, AlertCircle } from 'lucide-react';

interface OrderConfirmationProps {
  customerName: string;
  customerEmail: string;
  amountPaid: string;
  productPurchased: string;
  currency?: string;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  customerName,
  customerEmail,
  amountPaid,
  productPurchased,
  currency = 'USD',
}) => {
  return (
    <div className="h-full flex flex-col justify-center px-4 sm:px-6 lg:px-16 py-6 sm:py-8 lg:py-12 bg-white">
      <div className="max-w-xl mx-auto w-full">
        {/* Success Message */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-section font-bold text-black mb-2 sm:mb-3 lg:mb-4">
            Purchase Successful
          </h1>
          <p className="text-title text-black">
            Welcome aboard, {customerName}
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-sub font-bold text-black mb-4 sm:mb-5 lg:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
            Order Details
          </h2>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-start gap-2">
              <span className="text-body text-black font-medium">Customer Name</span>
              <span className="text-body text-black font-semibold text-right">{customerName}</span>
            </div>

            <div className="flex justify-between items-start gap-2">
              <span className="text-body text-black font-medium">Email Address</span>
              <span className="text-body text-black font-semibold text-right break-all">{customerEmail}</span>
            </div>

            <div className="flex justify-between items-start gap-2">
              <span className="text-body text-black font-medium">Purchased</span>
              <span className="text-body text-black font-semibold text-right">{productPurchased}</span>
            </div>

            <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-gray-200">
              <div className="flex justify-between items-center gap-2">
                <span className="text-title font-bold text-black">Amount Paid</span>
                <span className="text-sub font-bold text-black">{amountPaid}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
