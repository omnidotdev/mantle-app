import { Link, createFileRoute } from "@tanstack/react-router";

import appConfig from "@/lib/config/app.config";

const DashboardPage = () => {
  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-2 font-bold text-3xl">{appConfig.name}</h1>
      <p className="mb-8 text-gray-600">{appConfig.tagline}</p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Object.entries(appConfig.modules)
          .filter(([, config]) => config.enabled)
          .map(([key, config]) => (
            <Link
              key={key}
              to={
                `/${key}` as "/invoices" | "/people" | "/quotes" | "/inventory"
              }
              className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="text-3xl">{config.icon}</span>
              <span className="font-medium text-gray-700">{config.label}</span>
            </Link>
          ))}
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_auth/dashboard")({
  component: DashboardPage,
});
