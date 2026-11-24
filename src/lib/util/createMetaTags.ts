import app from "@/lib/config/app.config";
import { BASE_URL } from "@/lib/config/env.config";

interface Params {
  /** Page title, suffixed with the app name */
  title?: string;
  /** Page description, defaults to the app description */
  description?: string;
  /** Absolute URL of a 1200x630 social preview image */
  image?: string;
  /** Comma-separated keywords */
  keywords?: string;
  /** Canonical page URL, defaults to the app base URL */
  url?: string;
}

/**
 * Create meta tags. A social preview image is only emitted when one is passed,
 * so links unfurl as a text card until a final preview image exists
 */
const createMetaTags = ({
  title: _title,
  description: _description,
  url: _url,
  image,
  keywords,
}: Params = {}) => {
  const title = _title ? `${_title} | ${app.name}` : app.name,
    description = _description ?? app.description,
    url = _url ?? BASE_URL;

  const tags = [
    { title },
    {
      name: "description",
      content: description,
    },
    { name: "keywords", content: keywords },
    { name: "twitter:title", content: title },
    {
      name: "twitter:description",
      content: description,
    },
    { name: "twitter:creator", content: "@omnidotdev" },
    { name: "twitter:url", content: url },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    {
      property: "og:description",
      content: description,
    },
    { property: "og:url", content: url },
    ...(image
      ? [
          { name: "twitter:image", content: image },
          { name: "twitter:card", content: "summary_large_image" },
          { property: "og:image", content: image },
          { property: "og:image:width", content: "1200" },
          { property: "og:image:height", content: "630" },
        ]
      : [{ name: "twitter:card", content: "summary" }]),
  ];

  return tags;
};

export default createMetaTags;
