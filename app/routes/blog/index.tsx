import type { Route } from "./+types";
import {
  strapiPostToPostMeta,
  type Post,
  type StrapiPost,
  type StrapiResponse,
} from "~/types";
import PostCard from "~/components/PostCard";
import { useState } from "react";
import Pagination from "~/components/Pagination";
import PostFilter from "~/components/PostFilter";

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ posts: Post[] }> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/posts?populate=image&sort=date:desc`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    throw new Error(
      `Failed to load blog posts: ${res.status} ${res.statusText}`,
    );
  }

  const json: StrapiResponse<StrapiPost> = await res.json();

  const posts = json.data.map((item) => {
    return strapiPostToPostMeta(item, import.meta.env.VITE_STRAPI_URL);
  });

  return { posts };
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
