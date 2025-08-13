export const prerender = false;

import satori from "satori";
import sharp from "sharp";
import fs from "fs";
import path from "path";

const fontPath = path.join(process.cwd(), "public/fonts/SpaceGrotesk-Bold.ttf");
const fontData = fs.readFileSync(fontPath);

export async function GET({ params }) {
  const title = decodeURIComponent(params.title.replace(".png", ""));

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "1200px",
          height: "630px",
          backgroundColor: "#1a1c1e",
          color: "#e1e4e8",
          fontSize: "64px",
          fontFamily: "Space Grotesk",
          padding: "40px",
          textAlign: "center",
        },
        children: title,
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Space Grotesk",
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
}
