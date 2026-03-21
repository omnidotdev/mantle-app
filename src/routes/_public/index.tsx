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

import VolcanicCard from "@/components/core/VolcanicCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import signIn from "@/lib/auth/signIn";
import appConfig from "@/lib/config/app.config";
import { BASE_URL } from "@/lib/config/env.config";
import { signOutLocal } from "@/server/functions/auth";

export const Route = createFileRoute("/_public/")({
  beforeLoad: async ({ context: { session } }) => {
    // Redirect fully provisioned users to the authenticated area
    if (session?.user?.identityProviderId) throw redirect({ to: "/dashboard" });

    // Clear zombie sessions: user exists in IDP but identityProviderId is
    // missing (auth enrichment failed or cache expired). Without this, the
    // public layout shows "Sign Out" but the user can't reach /dashboard
    if (session?.user) {
      await signOutLocal();
    }
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
        {/* Decorative glow behind headline */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[400px] w-[600px] rounded-full bg-primary-500/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-8 flex justify-center">
            <Badge className="gap-2 px-4 py-2">{appConfig.tagline}</Badge>
          </div>

          <h1 className="mb-6 font-extrabold text-4xl tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">Business operations,</span>
            <span className="mt-2 block text-shimmer">
              forged under pressure
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
            People, invoices, quotes, and inventory — unified in a single
            bedrock platform. {appConfig.name} is the operations suite refined
            from the core. Free and open source.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="group h-12 gap-2 px-8 font-semibold shadow-lg"
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
            <h2 className="mb-4 font-bold text-3xl sm:text-4xl">
              Core modules, crystallized
            </h2>
            <p className="text-lg text-muted-foreground">
              Four essential modules forged into a unified operations layer
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {modules.map((mod) => (
              <VolcanicCard key={mod.title}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary dark:bg-primary-950">
                  {mod.icon}
                </div>
                <h3 className="mb-2 font-semibold text-lg">{mod.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {mod.description}
                </p>
              </VolcanicCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <Badge className="mb-4">How It Works</Badge>
            <h2 className="mb-4 font-bold text-3xl sm:text-4xl">
              Surface in minutes
            </h2>
            <p className="text-lg text-muted-foreground">
              No friction. Just solid ground.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.title}
                className="flex flex-col items-center rounded-2xl border border-base-200 bg-card p-8 text-center shadow-sm dark:border-base-800"
              >
                <div className="relative mb-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-base-200 bg-card shadow-md dark:border-base-800">
                    <div className="text-primary">{step.icon}</div>
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-xs">
                    {step.number}
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-xl">{step.title}</h3>
                <p className="max-w-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Source */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-base-200 bg-linear-to-br from-primary-50/50 to-background p-8 sm:p-12 lg:p-16 dark:border-base-800 dark:from-primary-950/30">
            <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
              <div className="max-w-xl text-center lg:text-left">
                <Badge className="mb-4">
                  <CheckCircle2Icon size={14} className="mr-1" />
                  Open Source
                </Badge>
                <h2 className="mb-4 font-bold text-3xl sm:text-4xl">
                  Forged in the open
                </h2>
                <p className="text-lg text-muted-foreground">
                  {appConfig.name} is completely open source. Inspect the code,
                  contribute features, or self-host on your own infrastructure.
                  Your data, your foundation.
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
          <h2 className="mb-6 font-bold text-4xl sm:text-5xl">
            Ready to build on <span className="text-shimmer">bedrock?</span>
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
            Stop shifting between tools. Build on a foundation that holds. Free
            and open source, forever.
          </p>

          <Button
            size="lg"
            className="group h-14 gap-2 px-10 font-semibold text-lg shadow-lg"
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

          <p className="mt-6 text-muted-foreground text-sm">
            No credit card required. Free and open source.
          </p>
        </div>
      </section>
    </div>
  );
}
