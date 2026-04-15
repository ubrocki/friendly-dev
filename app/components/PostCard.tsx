import { Link } from "react-router";
import type { Post } from "~/types";

type PostCardProps = {
  post: Post;
  showExcerpt?: boolean;
};

const PostCard = ({ post, showExcerpt = true }: PostCardProps) => {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="rounded-lg border border-gray-700 bg-gray-800/80 p-5 transition-colors hover:border-blue-400">
      <div className="mb-2 flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-wide text-gray-400">
          {formattedDate}
        </p>
      </div>

      <h3 className="text-xl font-semibold text-blue-400">{post.title}</h3>
      {showExcerpt && (
        <p className="mt-2 text-gray-300 leading-relaxed">{post.excerpt}</p>
      )}
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="mt-4 w-full h-48 object-cover rounded mb-4"
        />
      )}
      <Link
        to={`/blog/${post.slug}`}
        className="mt-4 inline-block text-blue-500 hover:underline"
      >
        Read More {"\u2192"}
      </Link>
    </article>
  );
};

export default PostCard;
