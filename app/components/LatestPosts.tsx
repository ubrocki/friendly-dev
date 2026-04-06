import type { PostMeta } from "~/types";
import PostCard from "./PostCard";

interface LatestPostsProps {
  posts: PostMeta[];
  limit?: number;
}

const LatestPosts = ({ posts, limit = 3 }: LatestPostsProps) => {
  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
  const latestPosts = sortedPosts.slice(0, limit);

  return (
    <div className="space-y-4">
      {latestPosts.map((post) => (
        <PostCard key={post.id} post={post} showExcerpt={false} />
      ))}
    </div>
  );
};

export default LatestPosts;
