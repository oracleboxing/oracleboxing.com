"use client";
import React from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

interface TimelineProps {
  data: TimelineEntry[];
  cta?: React.ReactNode;
}

export const Timeline = ({ data, cta }: TimelineProps) => {
  return (
    <div className="w-full bg-gray-50 md:px-10 overflow-hidden">
      <div className="max-w-4xl mx-auto pt-12 sm:pt-20 pb-6 sm:pb-8 px-4 md:px-8 lg:px-10">
        <h2 className="text-section font-bold mb-3 text-gray-900 text-center">
          Three courses working together to take you <span className="bg-yellow-100 text-black px-2 py-[2px]">from beginner to seriously good boxer.</span>
        </h2>
      </div>

      <div className="relative max-w-4xl mx-auto pb-4 sm:pb-12 px-4 md:px-8">
        {data.map((item, index) => (
          <div
            key={index}
            className="mb-6 sm:mb-16 md:mb-24"
          >
            <h3 className="text-section font-bold text-black mb-4 sm:mb-6 md:mb-8 text-left underline">
              {item.title}
            </h3>
            <div className="text-title font-medium text-black">
              {item.content}
            </div>
          </div>
        ))}
      </div>

      {cta && (
        <div className="text-center pb-4 sm:pb-20 px-4">
          {cta}
        </div>
      )}
    </div>
  );
};
