import { MetadataRoute } from "next";
import { getRoutes } from "@/app/actions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = await getRoutes();

  const routeEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `https://mg.rockmillclimbing.com/route/${route.id}`,
    lastModified: new Date(route.set_date),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: "https://mg.rockmillclimbing.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://mg.rockmillclimbing.com/sets",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://mg.rockmillclimbing.com/overview",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    ...routeEntries,
  ];
}
