import type { FC } from "react";
import type { Project } from "~/types";
import ProjectCard from "./ProjectCard";

interface FeaturedProjectsProps {
  featuredProjects: Project[];
  count: number;
}

const FeaturedProjects: FC<FeaturedProjectsProps> = ({
  featuredProjects: projects,
  count = 4,
}) => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 text-gray-400"></h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProjects;
