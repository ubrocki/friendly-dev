import FeaturedProjects from "~/components/FeaturedProjects";
import axios from "axios";
import type { PostMeta, Project } from "~/types";
import type { Route } from "./+types/index";
import AboutPreview from "../about/AboutPreview";
import LatestPosts from "~/components/LatestPosts";

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ projects: Project[]; posts: PostMeta[] }> {
  try {
    const projectsUrl = import.meta.env.VITE_API_URL + "/projects";
    const postsUrl = new URL("/posts-meta.json", request.url);

    const [projectsResponse, postsResponse] = await Promise.all([
      axios.get<Project[]>(projectsUrl, {
        signal: request.signal,
        params: { featured: true },
      }),
      fetch(postsUrl.href, { signal: request.signal }),
    ]);

    if (!postsResponse.ok) {
      throw new Error(
        `Failed to load blog posts: ${postsResponse.status} ${postsResponse.statusText}`,
      );
    }

    const posts: PostMeta[] = await postsResponse.json();
    posts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

    return { projects: projectsResponse.data, posts };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Response("Failed to load featured projects", {
        status: error.response?.status ?? 503,
        statusText: error.response?.statusText ?? "Service Unavailable",
      });
    }

    throw new Response("Unexpected server error", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "The friendly dveloper" },
    { name: "description", content: "Custom website development!" },
  ];
}

const HomePage = ({ loaderData }: Route.ComponentProps) => {
  const now = new Date().toISOString();
  const { projects, posts } = loaderData as {
    projects: Project[];
    posts: PostMeta[];
  };

  /*
  if (typeof window === "undefined") {
    console.log("Server render at time:", now);
  } else {
    console.log("Client hydration at time:", now);
  }
  */

  return (
    <>
      <FeaturedProjects featuredProjects={projects} count={2} />
      <AboutPreview />
      <section className="max-w-4xl mx-auto mt-12 px-6 py-8 bg-gray-900 rounded-xl">
        <h2 className="text-3xl font-bold text-gray-400 mb-8 text-center flex items-center justify-center gap-3">
          <span className="inline-block bg-linear-to-r from-blue-500 to-cyan-400 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            New
          </span>
          Latest Blog Posts
        </h2>
        <LatestPosts posts={posts} limit={3} />
      </section>
    </>
  );
};

export default HomePage;
