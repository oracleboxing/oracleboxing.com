"use client"

interface WhoIsForIllustrationProps {
  width?: string | number
  height?: string | number
  className?: string
}

export default function WhoIsForIllustration({
  width = "100%",
  height = "100%",
  className = "",
}: WhoIsForIllustrationProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Background */}
      <rect width="320" height="280" fill="white" />

      {/* Approved checkmark card */}
      <g transform="translate(40, 40)">
        <rect width="240" height="90" rx="12" fill="white" stroke="#E5E2DE" strokeWidth="1" />
        <circle cx="45" cy="45" r="25" fill="#E8F5E9" />
        <path
          d="M35 45L42 52L55 38"
          stroke="#4CAF50"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="85" y="28" width="120" height="12" rx="6" fill="#37322F" opacity="0.15" />
        <rect x="85" y="48" width="80" height="8" rx="4" fill="#37322F" opacity="0.08" />
      </g>

      {/* Declined X card */}
      <g transform="translate(40, 150)">
        <rect width="240" height="90" rx="12" fill="white" stroke="#E5E2DE" strokeWidth="1" />
        <circle cx="45" cy="45" r="25" fill="#FFEBEE" />
        <path
          d="M37 37L53 53M53 37L37 53"
          stroke="#EF5350"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="85" y="28" width="120" height="12" rx="6" fill="#37322F" opacity="0.15" />
        <rect x="85" y="48" width="80" height="8" rx="4" fill="#37322F" opacity="0.08" />
      </g>

      {/* Decorative elements */}
      <circle cx="290" cy="70" r="4" fill="#FF8000" opacity="0.3" />
      <circle cx="30" cy="200" r="3" fill="#FF8000" opacity="0.2" />
    </svg>
  )
}
