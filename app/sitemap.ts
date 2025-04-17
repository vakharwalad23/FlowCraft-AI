import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://flowcraftai.vercel.app";

  const routes = [
    "",
    "/about",
    "/features",
    "/pricing",
    "/contact",
    "/blog",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return routes;
}
