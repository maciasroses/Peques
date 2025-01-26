import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const languages = ["es"];

  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/login",
    "/register",
    "/terms-of-service",
    "/privacy-policy",
  ];

  const staticSitemap = staticRoutes.flatMap((route) =>
    languages.map((lng) => ({
      url: `${baseUrl}/${lng}${route}`,
      lastModified: new Date().toISOString(),
    }))
  );

  const dynamicData = [
    { slug: "example-slug-1", updatedAt: "2024-08-18T10:00:00Z" },
    { slug: "example-slug-2", updatedAt: "2024-08-17T12:00:00Z" },
  ];

  const dynamicSitemap = dynamicData.flatMap((item) =>
    languages.map((lng) => ({
      url: `${baseUrl}/${lng}/${item.slug}`,
      lastModified: item.updatedAt,
    }))
  );

  return [...staticSitemap, ...dynamicSitemap];
}
