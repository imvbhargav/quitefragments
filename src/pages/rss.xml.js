import rss from "@astrojs/rss";
import { marked } from "marked";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("fragments");
  // Sort posts by date in descending order (latest first)
  const sortedPosts = posts.sort(
    (a, b) => new Date(b.data.date) - new Date(a.data.date),
  );
  return rss({
    title: "Quite Fragments",
    description: "Words that linger",
    site: "https://quitefragments.vercel.app",
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      link: `/fragments/${post.id}`,
      content: marked.parse(post.body),
    })),
    customData: `<language>en-us</language>`,
  });
}
