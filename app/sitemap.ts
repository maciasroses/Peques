import { getAllProducts } from "@/app/shared/services/product/controller";
import { getAllCollections } from "@/app/shared/services/collection/controller";
import type { MetadataRoute } from "next";
import type { IProduct, ICollection } from "@/app/shared/interfaces";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
const languages = ["es"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/login",
    "/register",
    "/terms-of-service",
    "/privacy-policy",
    "/checkout",
    "/checkout/success",
    "/collections",
    "/search",
  ];

  const staticSitemap = staticRoutes.flatMap((route) =>
    languages.map((lng) => ({
      url: `${baseUrl}/${lng}${route}`,
      lastModified: new Date().toISOString(),
      changefreq: "monthly",
      priority: 0.8,
    }))
  );

  const [dynamicProducts, dynamicCollections] = await Promise.all([
    fetchDynamic("product"),
    fetchDynamic("collection"),
  ]);

  const productsSitemap = dynamicProducts.flatMap((item) =>
    languages.map((lng) => ({
      url: `${baseUrl}/${lng}/products/${item.slug}`,
      lastModified: new Date(item.updatedAt).toISOString(),
      changefreq: "weekly",
      priority: 0.9,
    }))
  );

  const collectionsSitemap = dynamicCollections.flatMap((item) =>
    languages.map((lng) => ({
      url: `${baseUrl}/${lng}/collections/${item.slug}`,
      lastModified: new Date(item.updatedAt).toISOString(),
      changefreq: "weekly",
      priority: 0.7,
    }))
  );

  return [...staticSitemap, ...productsSitemap, ...collectionsSitemap];
}

async function fetchDynamic(type: "product" | "collection") {
  const data =
    type === "product"
      ? ((await getAllProducts()) as IProduct[])
      : ((await getAllCollections()) as ICollection[]);

  return data.map((item) => ({
    slug:
      type === "product" ? (item as IProduct).key : (item as ICollection).link,
    updatedAt: item.updatedAt,
  }));
}
