export type ProductVideoSource =
  | { type: "youtube"; embedUrl: string; id: string }
  | { type: "vimeo"; embedUrl: string; id: string }
  | { type: "file"; src: string };

function extractYouTubeId(url: URL): string | null {
  if (url.hostname === "youtu.be") {
    return url.pathname.slice(1).split("/")[0] || null;
  }

  if (url.hostname.includes("youtube.com")) {
    const fromQuery = url.searchParams.get("v");
    if (fromQuery) return fromQuery;

    const parts = url.pathname.split("/").filter(Boolean);
    const embedIndex = parts.indexOf("embed");
    if (embedIndex >= 0 && parts[embedIndex + 1]) {
      return parts[embedIndex + 1];
    }

    const shortsIndex = parts.indexOf("shorts");
    if (shortsIndex >= 0 && parts[shortsIndex + 1]) {
      return parts[shortsIndex + 1];
    }
  }

  return null;
}

function extractVimeoId(url: URL): string | null {
  if (!url.hostname.includes("vimeo.com")) return null;

  const parts = url.pathname.split("/").filter(Boolean);
  const id = parts.find((part) => /^\d+$/.test(part));
  return id ?? null;
}

function isDirectVideoUrl(url: URL): boolean {
  const path = url.pathname.toLowerCase();
  return (
    /\.(mp4|webm|ogg|mov)(\?|$)/i.test(path) ||
    path.includes("/storage/v1/object/public/")
  );
}

export function parseProductVideoUrl(
  rawUrl?: string | null
): ProductVideoSource | null {
  const trimmed = rawUrl?.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);

    const youtubeId = extractYouTubeId(url);
    if (youtubeId) {
      return {
        type: "youtube",
        id: youtubeId,
        embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`,
      };
    }

    const vimeoId = extractVimeoId(url);
    if (vimeoId) {
      return {
        type: "vimeo",
        id: vimeoId,
        embedUrl: `https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0`,
      };
    }

    if (isDirectVideoUrl(url)) {
      return { type: "file", src: trimmed };
    }

    return null;
  } catch {
    return null;
  }
}

export function hasProductVideo(rawUrl?: string | null): boolean {
  return parseProductVideoUrl(rawUrl) !== null;
}
