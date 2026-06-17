import { get, head, put, type PutBlobResult } from "@vercel/blob";

export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function uploadPrivateBlob(
  pathname: string,
  body: Buffer | Blob | string,
  contentType?: string,
): Promise<PutBlobResult> {
  return put(pathname, body, {
    access: "private",
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function getPrivateBlob(pathname: string) {
  return get(pathname, { access: "private" });
}

/** Публичный URL для private blob через download API Vercel */
export async function getPrivateBlobUrl(pathname: string): Promise<string | null> {
  if (!isBlobConfigured()) return null;
  try {
    const meta = await head(pathname);
    return meta.downloadUrl;
  } catch {
    return null;
  }
}
