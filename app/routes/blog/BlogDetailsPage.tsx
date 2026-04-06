import ReactMarkdown from "react-markdown";
import type { PostMeta } from "~/types";
import type { Route } from "./+types/BlogDetailsPage";
import { Link } from "react-router";

export async function loader({
  request,
  params,
}: Route.LoaderArgs): Promise<{ postMeta: PostMeta; markdown: string }> {
  const { slug } = params;

  if (!slug) {
    throw new Response("Slug is required", { status: 400 });
  }

  const url = new URL(`/posts-meta.json`, request.url);
  const res = await fetch(url.href);

  if (!res.ok) {
    throw new Error(
      `Failed to load blog posts: ${res.status} ${res.statusText}`,
    );
  }

  const posts: PostMeta[] = await res.json();
  const postMeta = posts.find((p) => p.slug === slug);

  if (!postMeta) {
    throw new Response("Post not found", { status: 404 });
  }

  // Dynamically import the markdown content for the post
  const md = await import(`../../posts/${slug}.md?raw`);
  return { postMeta, markdown: md.default as string };
}

const BlogDetailsPage = ({ loaderData }: Route.ComponentProps) => {
  const { postMeta, markdown } = loaderData;

  return (
    <section className="max-w-3xl mx-auto mt-12 px-6 py-8 bg-gray-900 rounded-xl">
      <h1 className="text-4xl font-bold text-blue-400 mb-4">
        {postMeta.title}
      </h1>
      <p className="text-sm uppercase tracking-wide text-gray-400 mb-8">
        {new Date(postMeta.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div className="max-w-none mb-12 text-gray-400 prose prose-invert">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>

      <Link
        to="/blog"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:underline"
      >
        {"\u2190"} Back to Blog
      </Link>
    </section>
  );
};

export default BlogDetailsPage;
