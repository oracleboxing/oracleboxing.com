'use client'

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAnalytics } from "@/hooks/useAnalytics";

interface EpicCTAButtonProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  asChild?: boolean;
  trackingName?: string; // For Vercel Analytics tracking
}

export function EpicCTAButton({
  children,
  className,
  size = "md",
  href,
  onClick,
  asChild = false,
  trackingName
}: EpicCTAButtonProps) {
  const { trackButtonClick } = useAnalytics();

  // Debug logging
  useEffect(() => {
    if (typeof window !== 'undefined' && trackingName) {
      console.log(`Button ${trackingName} - href:`, href);
    }
  }, [href, trackingName]);

  const handleClick = (e?: React.MouseEvent) => {
    // Track button click for analytics (this is a scroll-to-pricing button, NOT AddToCart)
    // AddToCart fires when user actually clicks a pricing card to go to /checkout
    if (trackingName) {
      trackButtonClick({
        button_location: trackingName,
        button_type: 'primary-cta',
        destination: '#pricing',
      });

      console.log('Button click tracked (scroll to pricing):', {
        location: trackingName,
        action: 'scroll-to-pricing'
      });
    }

    // Scroll to pricing section with smooth animation
    if (typeof window !== 'undefined') {
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // Call onClick callback if provided
    if (onClick) {
      onClick();
    }
  };
  const sizeClasses = {
    sm: "min-h-9 px-5 text-body py-1.5",
    md: "min-h-10 px-6 text-body py-1.5",
    lg: "py-3 sm:py-4 lg:py-5 px-8 sm:px-10 lg:px-12 text-sub"
  };

  const buttonContent = (
    <>
      <span className="font-black">{children}</span>
    </>
  );

  const buttonClasses = cn(
    "inline-flex items-center justify-center",
    "bg-yellow-100 hover:bg-black",
    "text-black hover:text-white font-black",
    "border-4 border-black",
    "rounded-xl",
    "transition-colors duration-300",
    "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
    "cursor-pointer",
    "animate-bounce-subtle",
    "uppercase tracking-wide",
    sizeClasses[size],
    className
  );

  const buttonStyle = {
    cursor: 'pointer'
  };

  if (asChild) {
    return (
      <div className={buttonClasses} style={buttonStyle} onClick={handleClick}>
        {buttonContent}
      </div>
    );
  }

  if (href) {
    return (
      <a href={href} className={buttonClasses} style={buttonStyle} onClick={handleClick}>
        {buttonContent}
      </a>
    );
  }

  return (
    <button className={buttonClasses} style={buttonStyle} onClick={handleClick}>
      {buttonContent}
    </button>
  );
}
