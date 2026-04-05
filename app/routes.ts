import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layouts/HomeLayout.tsx", [index("routes/home/index.tsx")]),
  layout("routes/layouts/MainLayout.tsx", [
    route("about", "./routes/about/index.tsx"),
    route("contact", "./routes/contact/index.tsx"),
    route("posts", "./routes/posts/index.tsx"),
    route("projects", "./routes/projects/index.tsx"),
    route("projects/:id", "./routes/projects/ProjectDetailsPage.tsx"),
    route("blog", "./routes/blog/index.tsx"),
  ]),
] satisfies RouteConfig;
