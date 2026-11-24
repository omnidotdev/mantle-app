import type { LocationRewrite } from "@tanstack/react-router";

/**
 * Public demo. `/demo/...` is a URL rewrite of the sample workspace's real
 * routes (`/@basalt/...`), so the demo runs the actual screens. While the
 * browser is on a `/demo` URL, `graphqlFetch` answers every operation from
 * in-memory sample data and the root route supplies a sample session, so the
 * demo never reaches the API or the auth server and never touches real data
 */
export const DEMO_PATH = "/demo";

export const DEMO_WORKSPACE_SLUG = "basalt";

export const DEMO_ORGANIZATION_ID = "org_basalt_studio";

const WORKSPACE_PATH = `/@${DEMO_WORKSPACE_SLUG}`;

/** Swap a path prefix, keeping the rest of the path */
const swapPrefix = (pathname: string, from: string, to: string) =>
  pathname === from || pathname.startsWith(`${from}/`)
    ? `${to}${pathname.slice(from.length)}`
    : null;

/** Whether a path or href (`/demo/quotes?x=1`) is inside the demo */
export const isDemoHref = (href: string | undefined): boolean =>
  !!href && /^\/demo(?:[/?#]|$)/.test(href);

/**
 * Whether the browser is currently on a demo URL. Client-only: the demo
 * workspace never renders on the server, so this is always false there and a
 * server request can never be answered with sample data
 */
export const isDemoActive = (): boolean =>
  typeof window !== "undefined" && isDemoHref(window.location.pathname);

/**
 * Router rewrite between the public `/demo/...` URLs and the sample
 * workspace's internal `/@basalt/...` routes. Links are only rewritten back
 * to `/demo` while the demo is open, so a real workspace that happens to use
 * the same handle keeps its own URLs. Create one per router: on the server
 * that is one per request, which is how the server render (and its canonical
 * URL check) knows the request is for the demo
 */
export const createDemoRewrite = (): LocationRewrite => {
  let serverRequestIsDemo = false;

  const inDemo = () =>
    typeof window === "undefined" ? serverRequestIsDemo : isDemoActive();

  return {
    input: ({ url }) => {
      const pathname = swapPrefix(url.pathname, DEMO_PATH, WORKSPACE_PATH);
      if (typeof window === "undefined") serverRequestIsDemo = !!pathname;
      if (!pathname) return undefined;

      url.pathname = pathname;

      return url;
    },
    output: ({ url }) => {
      if (!inDemo()) return undefined;

      const pathname = swapPrefix(url.pathname, WORKSPACE_PATH, DEMO_PATH);
      if (!pathname) return undefined;

      url.pathname = pathname;

      return url;
    },
  };
};
