import fs from "fs";
import path from "path";
import satori from "satori";
import sharp from "sharp";
import matter from "gray-matter";

// Paths
const postsDir = path.join(process.cwd(), "src/data/fragments");
const outputDir = path.join(process.cwd(), "public/og");

// Ensure output dir exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Load font
const fontPath = path.join(process.cwd(), "public/fonts/SpaceGrotesk-Bold.ttf");
const fontData = fs.readFileSync(fontPath);

async function generateImage(title, slug) {
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "1200px",
          height: "630px",
          backgroundColor: "#1a1c1e",
          color: "#e1e4e8",
          fontSize: "64px",
          fontFamily: "Space Grotesk",
          textAlign: "center",
          padding: "40px",
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
  const outPath = path.join(outputDir, `${slug}.png`);
  fs.writeFileSync(outPath, png);
  console.log(`[+] Generated OG: ${outPath}`);
}

async function main() {
  const files = fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  for (const file of files) {
    const content = fs.readFileSync(path.join(postsDir, file), "utf-8");
    const { data } = matter(content); // read frontmatter
    const title = data.title || "Untitled";
    const slug = file.replace(/\.(md|mdx)$/, "");
    await generateImage(title, slug);
  }
}

main();
