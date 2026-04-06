import type { Route } from "./+types";
import type { PostMeta } from "~/types";
import PostCard from "~/components/PostCard";
import { useState } from "react";
import Pagination from "~/components/Pagination";
import PostFilter from "~/components/PostFilter";

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ posts: PostMeta[] }> {
  const url = new URL("/posts-meta.json", request.url);
  const res = await fetch(url.href);

  if (!res.ok) {
    throw new Error(
      `Failed to load blog posts: ${res.status} ${res.statusText}`,
    );
  }

  const data = await res.json();
  data.sort((a: PostMeta, b: PostMeta) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA; // Sort by date descending
  });

  return { posts: data };
}

const BlogPage = ({ loaderData }: Route.ComponentProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { posts } = loaderData;

  const postsPerPage = 3;

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const hasFilteredPosts = (filteredPosts?.length ?? 0) > 0;

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <section className="max-w-4xl mx-auto mt-12 px-6 py-8 bg-gray-900 rounded-xl">
      <h2 className="text-3xl font-bold text-gray-400 mb-8 text-center">
        📝 Blog
      </h2>

      <PostFilter
        searchQuery={searchQuery}
        onSearchQueryChange={(query) => {
          setSearchQuery(query);
          setCurrentPage(1); // Reset to first page on search
        }}
      />

      {hasFilteredPosts ? (
        <div className="space-y-4">
          {currentPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No posts found.</p>
      )}

      {hasFilteredPosts && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  );
};

export default BlogPage;
