import sharp from "sharp";

export async function createImage(title, text) {
  const svg = `
  <svg width="900" height="500" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#020617"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
    </defs>

    <rect width="100%" height="100%" rx="24" fill="url(#bg)"/>

    <text x="50" y="90"
          font-size="46"
          fill="#38bdf8"
          font-weight="700"
          font-family="Arial, sans-serif">
      ${title}
    </text>

    <foreignObject x="50" y="130" width="800" height="320">
      <div xmlns="http://www.w3.org/1999/xhtml"
           style="
             color:#e5e7eb;
             font-size:26px;
             line-height:1.4;
             font-family:Arial, sans-serif;">
        ${text}
      </div>
    </foreignObject>
  </svg>
  `;

  const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return buffer; // 👈 important: return buffer, not file
}