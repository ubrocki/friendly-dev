import type { Project } from "~/types";
import type { Route } from "./+types";
import ProjectCard from "~/components/ProjectCard";
import axios from "axios";
import { useState } from "react";
import Pagination from "~/components/Pagination";
import { AnimatePresence, motion } from "framer-motion";

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ projects: Project[] }> {
  try {
    const projectsUrl = import.meta.env.VITE_API_URL + "/projects";
    const response = await axios.get<Project[]>(projectsUrl, {
      signal: request.signal,
    });

    return { projects: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Response("Failed to load projects", {
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
    { title: "The friendly developer - Projects" },
    { name: "description", content: "My project portfolio!" },
  ];
}

const ProjectsPage = ({ loaderData }: Route.ComponentProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);

  const { projects } = loaderData as { projects: Project[] };

  // Get unique categories from the projects for filtering
  const categories = [
    "All",
    ...Array.from(new Set(projects.map((project) => project.category))),
  ];

  // Filter projects based on the selected category
  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  // Calculate the total pages based on the number of projects and projects per page
  const projectsPerPage = 5;
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  // Get the projects for the current page
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject,
  );

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-400 mb-8 text-center">
        💼 Projects
      </h2>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded text-sm cursor-pointer ${
              category === selectedCategory
                ? "bg-blue-400 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div className="grid gap-6 sm:grid-cols-2">
          {currentProjects.map((project) => (
            <motion.div key={project.id} layout>
              <ProjectCard key={project.id} project={project} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default ProjectsPage;
