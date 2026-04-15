import {
  strapiProjectToProject,
  type Project,
  type StrapiProject,
  type StrapiResponse,
} from "~/types";
import type { Route } from "./+types/ProjectDetailsPage";
import { Link } from "react-router";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function delay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    const onAbort = () => {
      clearTimeout(timeoutId);
      reject(new DOMException("Aborted", "AbortError"));
    };

    if (signal.aborted) {
      onAbort();
      return;
    }

    signal.addEventListener("abort", onAbort, { once: true });
  });
}

/* This is just an example of client side loading. We could have also used a server loader */
export async function clientLoader({
  request,
  params,
}: Route.ClientLoaderArgs): Promise<Project> {
  const { id: documentId } = params;

  if (!documentId) {
    throw new Response("Project id is required", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  // Temporary artificial delay so HydrateFallback is visible during development.
  await delay(1500, request.signal);

  const projectsUrl = import.meta.env.VITE_API_URL + "/projects";
  const response = await fetch(
    `${projectsUrl}?filters[documentId][$eq]=${documentId}&populate=*`,
    {
      signal: request.signal,
    },
  );

  if (!response.ok) {
    throw new Response("Failed to load project", {
      status: response.status,
      statusText: response.statusText,
    });
  }

  const json: StrapiResponse<StrapiProject> = await response.json();

  const item = json.data[0];

  if (!item) {
    throw new Response("Project not found", {
      status: 404,
      statusText: "Not Found",
    });
  }

  return strapiProjectToProject(item, import.meta.env.VITE_STRAPI_URL);
}

export function HydrateFallback() {
  return (
    <div className="text-center text-gray-400 animate-pulse">
      <h2 className="text-3xl font-bold mb-4">Loading project...</h2>
      <p className="text-lg mb-2">Fetching project details.</p>
      <p className="text-sm text-gray-500">Please wait a moment.</p>
    </div>
  );
}

const ProjectDetailsPage = ({ loaderData }: Route.ComponentProps) => {
  const project = loaderData as Project;

  return (
    <section className="max-w-4xl mx-auto mt-12 px-6 py-8 bg-gray-900 rounded-xl">
      <Link
        to={`/projects`}
        className="flex items-center text-blue-400 hover:text-blue-500 mb-6 transition"
      >
        <FaArrowLeft className="mr-2" />
        Back to Projects
      </Link>
      <div className="grid gap-8 md:grid-cols-2 items-start">
        <div>
          <img
            src={project.image}
            alt={project.title}
            className="w-full rounded-lg shadow-md"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-blue-400 mb-4">
            {project.title}
          </h1>
          <p className="text-gray-600 text-sm mb-4">
            {new Date(project.date).toLocaleDateString()} • {project.category}
          </p>
          <p className="text-gray-400 mb-6">{project.description}</p>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
          >
            View Live Site
            <FaArrowRight className="ml-2 h-3 w-3" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetailsPage;
