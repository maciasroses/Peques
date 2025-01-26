const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export default function robots() {
  return {
    rules: [
      {
        allow: "/",
        userAgent: "*",
        disallow: ["/admin", "/api", "/profile"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
