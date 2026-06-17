import { getPrivateBlob, isBlobConfigured } from "@/shared/lib/blob";

/** Прокси для private Vercel Blob — стрим WebP с долгим кэшем */
export async function GET(request: Request) {
  if (!isBlobConfigured()) {
    return Response.json({ error: "Blob не настроен" }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const pathname = searchParams.get("pathname");

  if (!pathname || pathname.includes("..")) {
    return Response.json({ error: "pathname обязателен" }, { status: 400 });
  }

  const result = await getPrivateBlob(pathname);
  if (!result?.stream) {
    return Response.json({ error: "Файл не найден" }, { status: 404 });
  }

  return new Response(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType ?? "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
