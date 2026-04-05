import FeaturedProjects from "~/components/FeaturedProjects";
import axios from "axios";
import type { Project } from "~/types";
import type { Route } from "./+types/index";
import AboutPreview from "../about/AboutPreview";

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ projects: Project[] }> {
  try {
    const projectsUrl = import.meta.env.VITE_API_URL + "/projects";
    const response = await axios.get<Project[]>(projectsUrl, {
      signal: request.signal,
      params: { featured: true },
    });

    return { projects: response.data };
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
  const { projects } = loaderData as { projects: Project[] };

  if (typeof window === "undefined") {
    console.log("Server render at time:", now);
  } else {
    console.log("Client hydration at time:", now);
  }

  return (
    <>
      <FeaturedProjects featuredProjects={projects} count={2} />
      <AboutPreview />
    </>
  );
};

export default HomePage;
