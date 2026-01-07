import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "YouTube Banner Designer - Oracle Boxing",
  description: "Design and export YouTube channel banner",
}

export default function YouTubeBannerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          @font-face {
            font-family: 'ClashDisplay';
            src: url('/fonts/ClashDisplay/ClashDisplay-Bold.woff2') format('woff2');
            font-weight: 700;
            font-style: normal;
            font-display: swap;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: system-ui, -apple-system, sans-serif;
          }
        `}} />
      </head>
      <body>{children}</body>
    </html>
  )
}
