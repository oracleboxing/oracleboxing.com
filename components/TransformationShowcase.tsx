'use client'

export function TransformationShowcase() {
  const benefits = [
    "Build real boxing fundamentals from day one",
    "Move with confidence and proper technique",
    "Avoid bad habits that hold most beginners back",
    "Train smarter with structured progression",
    "See visible improvement in weeks, not years",
  ]

  return (
    <section className="w-full py-12 md:py-16 px-4 md:px-0">
      {/* Outer container with thick border pattern */}
      <div className="w-full max-w-[1800px] mx-auto">
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{ padding: '20px' }}
        >
          {/* Pattern border background */}
          <div className="absolute inset-0 bg-[#37322F] overflow-hidden rounded-2xl">
            {/* Animated flowing ribbons/orbs */}
            <div className="ribbon ribbon-1" />
            <div className="ribbon ribbon-2" />
            <div className="ribbon ribbon-3" />
            <div className="ribbon ribbon-4" />
            <div className="ribbon ribbon-5" />
            <div className="ribbon ribbon-6" />
            <div className="ribbon ribbon-7" />
            <div className="ribbon ribbon-8" />
            <div className="ribbon ribbon-9" />
            <div className="ribbon ribbon-10" />
          </div>

          {/* Inner white card */}
          <div className="relative bg-white p-4 md:p-6 lg:p-8 rounded-xl">
            {/* Desktop layout */}
            <div className="hidden lg:grid lg:grid-cols-10 gap-4 lg:gap-6 items-center">
              {/* Left column - Benefits (spans 2 cols) */}
              <div className="flex flex-col gap-4 lg:col-span-2 lg:pl-6 lg:pr-4">
                <h3 className="text-[#37322F] text-xl md:text-2xl font-medium mb-2" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
                  Why Learn Boxing Properly?
                </h3>
                <ul className="flex flex-col gap-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#37322F] flex items-center justify-center mt-0.5">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.5 6L5 8.5L9.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-[#49423D] text-sm md:text-base leading-relaxed">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Kris transformation - Middle columns (spans 4 cols) */}
              <div className="grid grid-cols-2 gap-0 lg:col-span-4">
                {/* Before Video */}
                <div className="relative overflow-hidden aspect-[9/16] bg-[#37322F] rounded-l-lg">
                  <video
                    src="https://sb.oracleboxing.com/kris_before.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-[120%] h-full object-cover left-1/2 -translate-x-1/2"
                  />
                  {/* BEFORE label - top left */}
                  <div className="absolute top-3 left-3 bg-[#37322F]/80 backdrop-blur-sm px-3 py-1.5 rounded-md">
                    <span className="text-white text-xs md:text-sm font-semibold tracking-wide">
                      BEFORE
                    </span>
                  </div>
                </div>

                {/* After Video */}
                <div className="relative overflow-hidden aspect-[9/16] bg-[#37322F] rounded-r-lg">
                  <video
                    src="https://sb.oracleboxing.com/kris_after.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-[120%] h-full object-cover left-1/2 -translate-x-1/2"
                  />
                  {/* AFTER label - top right */}
                  <div className="absolute top-3 right-3 bg-[#37322F]/80 backdrop-blur-sm px-3 py-1.5 rounded-md">
                    <span className="text-white text-xs md:text-sm font-semibold tracking-wide">
                      AFTER
                    </span>
                  </div>
                </div>
              </div>

              {/* Shalyn transformation - Right columns (spans 4 cols) */}
              <div className="grid grid-cols-2 gap-0 lg:col-span-4">
                {/* Before Video */}
                <div className="relative overflow-hidden aspect-[9/16] bg-[#37322F] rounded-l-lg">
                  <video
                    src="https://sb.oracleboxing.com/transfo-v2/sha-lyn2.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-[120%] h-full object-cover left-1/2 -translate-x-1/2"
                  />
                  {/* BEFORE label - top left */}
                  <div className="absolute top-3 left-3 bg-[#37322F]/80 backdrop-blur-sm px-3 py-1.5 rounded-md">
                    <span className="text-white text-xs md:text-sm font-semibold tracking-wide">
                      BEFORE
                    </span>
                  </div>
                </div>

                {/* After Video */}
                <div className="relative overflow-hidden aspect-[9/16] bg-[#37322F] rounded-r-lg">
                  <video
                    src="https://sb.oracleboxing.com/transfo-v2/sha-lyn1.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-[120%] h-full object-cover left-1/2 -translate-x-1/2"
                  />
                  {/* AFTER label - top right */}
                  <div className="absolute top-3 right-3 bg-[#37322F]/80 backdrop-blur-sm px-3 py-1.5 rounded-md">
                    <span className="text-white text-xs md:text-sm font-semibold tracking-wide">
                      AFTER
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile layout - Videos first, then text */}
            <div className="lg:hidden flex flex-col gap-6">
              {/* Videos row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Kris transformation */}
                <div className="grid grid-cols-2 gap-0">
                  {/* Before Video */}
                  <div className="relative overflow-hidden aspect-[9/16] bg-[#37322F] rounded-l-lg">
                    <video
                      src="https://sb.oracleboxing.com/kris_before.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 w-[120%] h-full object-cover left-1/2 -translate-x-1/2"
                    />
                    {/* BEFORE label - top left */}
                    <div className="absolute top-2 left-2 bg-[#37322F]/80 backdrop-blur-sm px-2 py-1 rounded-md">
                      <span className="text-white text-[10px] font-semibold tracking-wide">
                        BEFORE
                      </span>
                    </div>
                  </div>

                  {/* After Video */}
                  <div className="relative overflow-hidden aspect-[9/16] bg-[#37322F] rounded-r-lg">
                    <video
                      src="https://sb.oracleboxing.com/kris_after.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 w-[120%] h-full object-cover left-1/2 -translate-x-1/2"
                    />
                    {/* AFTER label - top right */}
                    <div className="absolute top-2 right-2 bg-[#37322F]/80 backdrop-blur-sm px-2 py-1 rounded-md">
                      <span className="text-white text-[10px] font-semibold tracking-wide">
                        AFTER
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shalyn transformation */}
                <div className="grid grid-cols-2 gap-0">
                  {/* Before Video */}
                  <div className="relative overflow-hidden aspect-[9/16] bg-[#37322F] rounded-l-lg">
                    <video
                      src="https://sb.oracleboxing.com/transfo-v2/sha-lyn2.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 w-[120%] h-full object-cover left-1/2 -translate-x-1/2"
                    />
                    {/* BEFORE label - top left */}
                    <div className="absolute top-2 left-2 bg-[#37322F]/80 backdrop-blur-sm px-2 py-1 rounded-md">
                      <span className="text-white text-[10px] font-semibold tracking-wide">
                        BEFORE
                      </span>
                    </div>
                  </div>

                  {/* After Video */}
                  <div className="relative overflow-hidden aspect-[9/16] bg-[#37322F] rounded-r-lg">
                    <video
                      src="https://sb.oracleboxing.com/transfo-v2/sha-lyn1.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 w-[120%] h-full object-cover left-1/2 -translate-x-1/2"
                    />
                    {/* AFTER label - top right */}
                    <div className="absolute top-2 right-2 bg-[#37322F]/80 backdrop-blur-sm px-2 py-1 rounded-md">
                      <span className="text-white text-[10px] font-semibold tracking-wide">
                        AFTER
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits text below videos on mobile */}
              <div className="flex flex-col gap-4 px-2">
                <h3 className="text-[#37322F] text-xl font-medium mb-2" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
                  Why Learn Boxing Properly?
                </h3>
                <ul className="flex flex-col gap-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#37322F] flex items-center justify-center mt-0.5">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.5 6L5 8.5L9.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-[#49423D] text-sm leading-relaxed">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ribbon {
          position: absolute;
          width: 150px;
          height: 150px;
          background: radial-gradient(circle,
            rgba(255,252,245,0.4) 0%,
            rgba(255,252,245,0.2) 40%,
            transparent 70%
          );
          border-radius: 50%;
          filter: blur(30px);
        }
        .ribbon-1 {
          top: 5%;
          left: 5%;
          width: 200px;
          height: 200px;
          animation: float1 8s ease-in-out infinite;
        }
        .ribbon-2 {
          top: 20%;
          left: 25%;
          width: 120px;
          height: 120px;
          animation: float2 10s ease-in-out infinite;
          animation-delay: -2s;
        }
        .ribbon-3 {
          top: 60%;
          left: 10%;
          width: 180px;
          height: 180px;
          animation: float3 9s ease-in-out infinite;
          animation-delay: -4s;
        }
        .ribbon-4 {
          top: 80%;
          left: 30%;
          width: 100px;
          height: 100px;
          animation: float1 7s ease-in-out infinite;
          animation-delay: -1s;
        }
        .ribbon-5 {
          top: 10%;
          right: 20%;
          width: 160px;
          height: 160px;
          animation: float2 11s ease-in-out infinite;
          animation-delay: -3s;
        }
        .ribbon-6 {
          top: 40%;
          right: 5%;
          width: 140px;
          height: 140px;
          animation: float3 8s ease-in-out infinite;
          animation-delay: -5s;
        }
        .ribbon-7 {
          top: 70%;
          right: 25%;
          width: 180px;
          height: 180px;
          animation: float1 10s ease-in-out infinite;
          animation-delay: -6s;
        }
        .ribbon-8 {
          top: 30%;
          left: 50%;
          width: 130px;
          height: 130px;
          animation: float2 9s ease-in-out infinite;
          animation-delay: -7s;
        }
        .ribbon-9 {
          top: 85%;
          right: 10%;
          width: 110px;
          height: 110px;
          animation: float3 7s ease-in-out infinite;
          animation-delay: -2s;
        }
        .ribbon-10 {
          top: 50%;
          left: 35%;
          width: 90px;
          height: 90px;
          animation: float1 6s ease-in-out infinite;
          animation-delay: -4s;
        }
        @keyframes float1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(30px, -20px) scale(1.1);
            opacity: 0.9;
          }
        }
        @keyframes float2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translate(-25px, 25px) scale(1.15);
            opacity: 0.85;
          }
        }
        @keyframes float3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.55;
          }
          50% {
            transform: translate(20px, 15px) scale(1.05);
            opacity: 0.8;
          }
        }
      `}</style>
    </section>
  )
}
