import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";

import appStyles from "@/styles.css?url";

const RootLayout = () => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href={appStyles} />
        <HeadContent />
      </head>
      <body className="min-h-screen bg-gray-50">
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
};

const rootRoute = createRootRoute({
  component: RootLayout,
});

export const Route = rootRoute;
