import ReactMarkdown from "react-markdown";
import {
  strapiPostToPostMeta,
  type Post,
  type StrapiPost,
  type StrapiResponse,
} from "~/types";
import type { Route } from "./+types/BlogDetailsPage";
import { Link } from "react-router";

export async function loader({
  request,
  params,
}: Route.LoaderArgs): Promise<{ post: Post }> {
  const { slug } = params;

  if (!slug) {
    throw new Response("Slug is required", { status: 400 });
  }

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/posts?filters[slug][$eq]=${slug}&populate=image`,
  );

  if (!res.ok) {
    throw new Error(
      `Failed to load blog posts: ${res.status} ${res.statusText}`,
    );
  }

  const json: StrapiResponse<StrapiPost> = await res.json();

  if (json.data.length === 0) {
    throw new Response("Post not found", { status: 404 });
  }

  const postMeta = strapiPostToPostMeta(
    json.data[0],
    import.meta.env.VITE_STRAPI_URL,
  );

  return { post: postMeta };
}

const BlogDetailsPage = ({ loaderData }: Route.ComponentProps) => {
  const { post } = loaderData;

  return (
    <section className="max-w-3xl mx-auto mt-12 px-6 py-8 bg-gray-900 rounded-xl">
      <h1 className="text-4xl font-bold text-blue-400 mb-4">{post.title}</h1>
      <p className="text-sm uppercase tracking-wide text-gray-400 mb-8">
        {new Date(post.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <img
        src={post.image}
        alt={post.title}
        className="w-full h-auto rounded-lg mb-8 object-cover"
      />

      <div className="max-w-none mb-12 text-gray-400 prose prose-invert">
        <ReactMarkdown>{post.body}</ReactMarkdown>
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
