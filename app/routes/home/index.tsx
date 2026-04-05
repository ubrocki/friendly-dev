import type { Route } from "./+types/index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "The friendly dveloper" },
    { name: "description", content: "Custom website development!" },
  ];
}

export default function Home() {
  const now = new Date().toISOString();

  if (typeof window === "undefined") {
    console.log("Server render at time:", now);
  } else {
    console.log("Client hydration at time:", now);
  }

  return <section>Homepage</section>;
}
