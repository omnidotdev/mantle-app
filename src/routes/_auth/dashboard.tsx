import { Link, createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";

import appConfig from "@/lib/config/app.config";

const DashboardPage = () => {
  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 font-bold text-3xl">{appConfig.name}</h1>
          <p className="text-gray-600">{appConfig.tagline}</p>
        </div>
        <Link
          to="/settings"
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          title="Settings"
        >
          <Settings size={18} />
          <span className="text-sm">Settings</span>
        </Link>
      </div>

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
