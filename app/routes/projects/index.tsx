import type { Project } from "~/types";
import type { Route } from "./+types";
import ProjectCard from "~/components/ProjectCard";
import axios from "axios";
import { useState } from "react";
import Pagination from "~/components/Pagination";

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ projects: Project[] }> {
  try {
    const response = await axios.get<Project[]>(
      "http://localhost:8000/projects",
      {
        signal: request.signal,
      },
    );

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

const ProjectsPage = ({ loaderData }: Route.ComponentProps) => {
  const { projects } = loaderData as { projects: Project[] };

  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the total pages based on the number of projects and projects per page
  const projectsPerPage = 2;
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  // Get the projects for the current page
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject,
  );


  return (
    <>
      <h2 className="text-3xl font-bold text-gray-400 mb-8 text-center">
        💼 Projects
      </h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {currentProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </>
  );
};

export default ProjectsPage;
