'use client';

import React, { Suspense, useEffect } from 'react';
import { Footer } from '@/components/Footer';
import Cal, { getCalApi } from "@calcom/embed-react";

function ChallengeOnlySuccessContent() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({"namespace":"personal-onboarding-call"});
      cal("ui", {"theme":"light","hideEventTypeDetails":false,"layout":"month_view"});
    })();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-16 py-6 sm:py-8 lg:py-12">
        <div className="max-w-4xl mx-auto w-full">
          {/* Instructions */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-4 sm:mb-6">
              Next Step: Book Your Personal Onboarding Call
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-black leading-relaxed">
              This is your consultation call where we'll get you set up and show you how to get the most out of your membership.
            </p>
          </div>

          {/* Cal.com Inline Embed */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden" style={{minHeight: '600px'}}>
            <Cal
              namespace="personal-onboarding-call"
              calLink="team/oracle-boxing/personal-onboarding-call"
              style={{width:"100%",height:"100%",overflow:"scroll"}}
              config={{"layout":"month_view","theme":"light"}}
            />
          </div>

          {/* Help Section */}
          <div className="mt-6 sm:mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
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

export default function ChallengeOnlySuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ChallengeOnlySuccessContent />
    </Suspense>
  );
}
