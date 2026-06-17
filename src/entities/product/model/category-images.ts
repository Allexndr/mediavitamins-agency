import categoryBlobPaths from "./category-blob-paths.json";

export function getCategoryImageUrl(categoryId: string, fallback?: string): string | undefined {
  const path = categoryBlobPaths[categoryId as keyof typeof categoryBlobPaths];
  if (!path) return fallback;
  if (path.startsWith("/")) return path;
  return `/api/media?pathname=${encodeURIComponent(path)}`;
}
