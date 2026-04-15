export type Project = {
  id: string;
  documentId: string;
  title: string;
  description: string;
  image: string;
  url: string;
  date: string;
  category: string;
  featured: boolean;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  body: string;
};

export type StrapiResponse<T> = {
  data: T[];
};

export type StrapiProject = {
  id: string;
  documentId: string;
  title: string;
  description: string;
  image?: {
    url: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
  };
  url: string;
  date: string;
  category: string;
  featured: boolean;
};

export type StrapiPost = {
  id: string;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  body: string;
  image?: {
    url: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
  };
};

export function strapiProjectToProject(
  project: StrapiProject,
  strapiBaseUrl = "",
): Project {
  const imageUrl = project.image?.url;
  const normalizedBaseUrl = strapiBaseUrl.endsWith("/")
    ? strapiBaseUrl.slice(0, -1)
    : strapiBaseUrl;

  return {
    id: project.id,
    documentId: project.documentId,
    title: project.title,
    description: project.description,
    image: imageUrl
      ? imageUrl.startsWith("http")
        ? imageUrl
        : `${normalizedBaseUrl}${imageUrl}`
      : "/images/no-image.png",
    url: project.url,
    date: project.date,
    category: project.category,
    featured: project.featured,
  };
}

export function strapiPostToPostMeta(
  post: StrapiPost,
  strapiBaseUrl = "",
): Post {
  const imageUrl = post.image?.url;
  const normalizedBaseUrl = strapiBaseUrl.endsWith("/")
    ? strapiBaseUrl.slice(0, -1)
    : strapiBaseUrl;

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    body: post.body,
    image: imageUrl
      ? imageUrl.startsWith("http")
        ? imageUrl
        : `${normalizedBaseUrl}${imageUrl}`
      : "/images/no-image.png",
  };
}
