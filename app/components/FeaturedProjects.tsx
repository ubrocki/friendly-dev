import type { FC } from "react";
import type { Project } from "~/types";
import ProjectCard from "./ProjectCard";

interface FeaturedProjectsProps {
  featuredProjects: Project[];
}

const FeaturedProjects: FC<FeaturedProjectsProps> = ({
  featuredProjects: projects,
}) => {
  if (projects.length === 0) {
    return null; // Don't render anything if there are no featured projects
  }

  return (
    <section>
      <h2 className="mb-6 flex items-center justify-center text-2xl font-bold text-gray-400">
        <span aria-hidden="true" className="mr-2 text-yellow-400">
          &#9733;
        </span>
        Featured Projects
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProjects;
