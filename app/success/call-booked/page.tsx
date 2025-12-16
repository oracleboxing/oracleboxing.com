'use client';

import React, { Suspense } from 'react';
import { Footer } from '@/components/Footer';
import Image from 'next/image';

function CallBookedContent() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-16 py-6 sm:py-8 lg:py-12">
        <div className="max-w-2xl mx-auto w-full">
          {/* Confirmation Card */}
          <div className="bg-white rounded-lg p-6 sm:p-8 lg:p-10 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 sm:mb-6 text-center">
              Your Call Has Been Booked!
            </h1>

            <div className="space-y-4 sm:space-y-6">
              <p className="text-sm sm:text-base lg:text-lg text-black leading-relaxed">
                Please make sure you add it to your calendar and arrive promptly on a laptop or computer with a good stable internet connection.
              </p>

              <div className="border-t border-gray-200 pt-4 sm:pt-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-4">
                  In the Meantime
                </h2>

                <p className="text-sm sm:text-base lg:text-lg text-black leading-relaxed mb-4">
                  Please look out for an email from <strong>Oracle Boxing Courses</strong> — the email will look similar to this:
                </p>

                <div className="relative w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden shadow-lg mb-4">
                  <Image
                    src="https://sb.oracleboxing.com/Website/skool_invite.png"
                    alt="Oracle Boxing Courses email invitation"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 768px"
                  />
                </div>

                <p className="text-sm sm:text-base lg:text-lg text-black leading-relaxed">
                  You need to accept that invitation because it is where you will access your courses.
                </p>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
            <p className="text-sm sm:text-base lg:text-lg text-black leading-relaxed text-center">
              If you need any help, please email us at{' '}
              <a
                href="mailto:team@oracleboxing.com"
                className="font-bold text-black hover:text-gray-700 underline"
              >
                team@oracleboxing.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function CallBookedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CallBookedContent />
    </Suspense>
  );
}
