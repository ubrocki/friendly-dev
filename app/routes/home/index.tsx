import FeaturedProjects from "~/components/FeaturedProjects";
import axios from "axios";
import {
  strapiPostToPostMeta as strapiPostToPost,
  strapiProjectToProject,
  type Post,
  type Project,
  type StrapiPost,
  type StrapiProject,
  type StrapiResponse,
} from "~/types";
import type { Route } from "./+types/index";
import AboutPreview from "../about/AboutPreview";
import LatestPosts from "~/components/LatestPosts";

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ projects: Project[]; posts: Post[] }> {
  try {
    const projectsUrl =
      import.meta.env.VITE_API_URL +
      "/projects?filters[featured][$eq]=true&populate=*";
    const postsUrl =
      import.meta.env.VITE_API_URL + "/posts?populate=image&sort=date:desc";

    const [projectResponse, postResponse] = await Promise.all([
      axios.get<StrapiResponse<StrapiProject>>(projectsUrl, {
        signal: request.signal,
        params: { featured: true },
      }),
      fetch(postsUrl, {
        signal: request.signal,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    ]);

    if (!postResponse.ok) {
      throw new Response("Failed to load blog posts", {
        status: postResponse.status,
        statusText: postResponse.statusText,
      });
    }

    const postJson: StrapiResponse<StrapiPost> = await postResponse.json();
    const posts = postJson.data.map((item) =>
      strapiPostToPost(item, import.meta.env.VITE_STRAPI_URL),
    );

    const projects: Project[] = projectResponse.data.data.map(
      (item: StrapiProject) =>
        strapiProjectToProject(item, import.meta.env.VITE_STRAPI_URL),
    );

    return { projects, posts };
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }

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
    posts: Post[];
  };

  /*
  if (typeof window === "undefined") {
    console.log("Server render at time:", now);
  } else {
    console.log("Client hydration at time:", now);
  }
  */

  return (
    <section className="max-w-3xl mx-auto mt-12 px-6 py-8 bg-gray-900 rounded-xl">
      <FeaturedProjects featuredProjects={projects} />
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
    </section>
  );
};

export default HomePage;
