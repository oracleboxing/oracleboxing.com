import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Oracle Boxing"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

const OG_IMAGE = "https://sb.oracleboxing.com/Website/skool_art2.webp"

export default async function Image() {
  // Next will use /opengraph-image whenever it decides it needs a default OG image.
  // We render the intended brand share image here so social previews are consistent.
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000",
        }}
      >
        <img
          src={OG_IMAGE}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    ),
    size
  )
}
