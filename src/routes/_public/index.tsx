import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  BoxesIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  FileTextIcon,
  RocketIcon,
  SparklesIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react";
import { LuGithub as GithubIcon } from "react-icons/lu";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import signIn from "@/lib/auth/signIn";
import appConfig from "@/lib/config/app.config";
import { BASE_URL } from "@/lib/config/env.config";

export const Route = createFileRoute("/_public/")({
  beforeLoad: ({ context: { session } }) => {
    if (session?.user) throw redirect({ to: "/dashboard" });
  },
  component: HomePage,
});

const modules = [
  {
    title: "People",
    description: "Manage contacts, companies, and relationships in one place",
    icon: <UsersIcon size={28} />,
  },
  {
    title: "Invoices",
    description: "Create, track, and manage invoices with real-time previews",
    icon: <FileTextIcon size={28} />,
  },
  {
    title: "Quotes & Contracts",
    description: "Draft quotes, convert to invoices, and close deals faster",
    icon: <ClipboardListIcon size={28} />,
  },
  {
    title: "Inventory",
    description: "Track products, stock levels, and adjustment history",
    icon: <BoxesIcon size={28} />,
  },
];

const steps = [
  {
    number: "01",
    title: "Sign In",
    description: "Authenticate with your Omni account to get started instantly",
    icon: <SparklesIcon size={24} />,
  },
  {
    number: "02",
    title: "Pick a Module",
    description: "Choose from People, Invoices, Quotes, or Inventory",
    icon: <ZapIcon size={24} />,
  },
  {
    number: "03",
    title: "Get to Work",
    description: "Start managing your business operations right away",
    icon: <RocketIcon size={24} />,
  },
];

function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative px-4 pt-20 pb-32 sm:px-6 md:pt-32 md:pb-40 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 flex justify-center">
            <Badge className="gap-2 px-4 py-2">{appConfig.description}</Badge>
          </div>

          <h1 className="mb-6 font-extrabold text-4xl text-gray-900 tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">Run your business,</span>
            <span className="mt-2 block text-teal-600">not your tools</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-gray-600 text-lg">
            People, invoices, quotes, and inventory — all in one place.{" "}
            {appConfig.name} is the unified operations suite that lets you focus
            on what matters. Free and open source.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="group h-12 gap-2 bg-teal-600 px-8 font-semibold text-white shadow-lg hover:bg-teal-700"
              onClick={() =>
                signIn({
                  redirectUrl: `${BASE_URL}/dashboard`,
                  providerId: "omni",
                })
              }
            >
              Get Started Free
              <ArrowRightIcon
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Button>

            <a
              href={appConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="h-12 gap-2 px-8">
                <GithubIcon size={18} />
                View on GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Module Showcase */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <Badge className="mb-4">Modules</Badge>
            <h2 className="mb-4 font-bold text-3xl text-gray-900 sm:text-4xl">
              Everything you need to operate
            </h2>
            <p className="text-gray-600 text-lg">
              Four integrated modules that cover your core business operations
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {modules.map((mod) => (
              <div
                key={mod.title}
                className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  {mod.icon}
                </div>
                <h3 className="mb-2 font-semibold text-gray-900 text-lg">
                  {mod.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {mod.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <Badge className="mb-4">How It Works</Badge>
            <h2 className="mb-4 font-bold text-3xl text-gray-900 sm:text-4xl">
              Up and running in minutes
            </h2>
            <p className="text-gray-600 text-lg">
              No complex setup. No steep learning curve.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.title}
                className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm"
              >
                <div className="relative mb-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-md">
                    <div className="text-teal-600">{step.icon}</div>
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 font-bold text-white text-xs">
                    {step.number}
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900 text-xl">
                  {step.title}
                </h3>
                <p className="max-w-xs text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Source */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-teal-50 to-white p-8 sm:p-12 lg:p-16">
            <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
              <div className="max-w-xl text-center lg:text-left">
                <Badge className="mb-4">
                  <CheckCircle2Icon size={14} className="mr-1" />
                  Open Source
                </Badge>
                <h2 className="mb-4 font-bold text-3xl text-gray-900 sm:text-4xl">
                  Built in the open, for everyone
                </h2>
                <p className="text-gray-600 text-lg">
                  {appConfig.name} is completely open source. Inspect the code,
                  contribute features, or self-host on your own infrastructure.
                  Your data, your rules.
                </p>
              </div>

              <a
                href={appConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="h-12 gap-2 px-6">
                  <GithubIcon size={20} />
                  View on GitHub
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 font-bold text-4xl text-gray-900 sm:text-5xl">
            Ready to unify your{" "}
            <span className="text-teal-600">operations?</span>
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-gray-600 text-lg">
            Stop juggling tools. Start running your business from one place.
            Free and open source, forever.
          </p>

          <Button
            size="lg"
            className="group h-14 gap-2 bg-teal-600 px-10 font-semibold text-lg text-white shadow-lg hover:bg-teal-700"
            onClick={() =>
              signIn({
                redirectUrl: `${BASE_URL}/dashboard`,
                providerId: "omni",
              })
            }
          >
            Get Started for Free
            <ArrowRightIcon
              size={20}
              className="transition-transform group-hover:translate-x-1"
            />
          </Button>

          <p className="mt-6 text-gray-500 text-sm">
            No credit card required. Free and open source.
          </p>
        </div>
      </section>
    </div>
  );
}
