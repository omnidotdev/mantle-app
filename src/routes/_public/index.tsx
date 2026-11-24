import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  BoxesIcon,
  FileTextIcon,
  LayoutGridIcon,
  LogInIcon,
  PlayIcon,
  ReceiptIcon,
  RocketIcon,
  UsersIcon,
} from "lucide-react";
import { LuGithub as GithubIcon } from "react-icons/lu";

import StatusBadge from "@/components/core/StatusBadge";
import { Button, buttonVariants } from "@/components/ui/button";
import { DEMO_PATH } from "@/features/demo/config";
import signIn from "@/lib/auth/signIn";
import appConfig from "@/lib/config/app.config";
import { BASE_URL } from "@/lib/config/env.config";
import { signOutLocal } from "@/server/functions/auth";
import { getLastOrgCookie } from "@/server/functions/lastWorkspace";

import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/_public/")({
  beforeLoad: async ({ context: { session } }) => {
    const user = session?.user;

    if (!user) return;

    // Fully provisioned: send them into their last-visited workspace (or their
    // first one), so the active workspace is always carried in the URL
    if (user.identityProviderId) {
      const organizations = session?.organizations ?? [];
      const lastSlug = await getLastOrgCookie();
      const landing =
        organizations.find((org) => org.slug === lastSlug) ?? organizations[0];

      if (landing) {
        throw redirect({
          to: "/@{$workspaceSlug}",
          params: { workspaceSlug: landing.slug },
        });
      }

      // Provisioned but not yet in any workspace: show the public page
      return;
    }

    // Clear zombie sessions: user exists in IDP but identityProviderId is
    // missing (auth enrichment failed or cache expired). Without this, the
    // public layout shows "Sign Out" but the user can't reach the app
    await signOutLocal();
  },
  component: HomePage,
});

const modules: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "People",
    description:
      "Contacts, companies, and how they connect, with CSV import and export",
    icon: UsersIcon,
  },
  {
    title: "Invoices",
    description:
      "Live previews, partial payments, workspace credit, and numbering per client",
    icon: ReceiptIcon,
  },
  {
    title: "Quotes & Contracts",
    description:
      "Fixed, hourly, and royalty pricing, a printable contract, and one click to invoice",
    icon: FileTextIcon,
  },
  {
    title: "Inventory",
    description:
      "Products, stock levels, and a full history of every adjustment",
    icon: BoxesIcon,
  },
];

const steps: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Sign in",
    description: "Use your Omni account. There is nothing to install.",
    icon: LogInIcon,
  },
  {
    title: "Pick a module",
    description: "Start with people, invoices, quotes, or inventory.",
    icon: LayoutGridIcon,
  },
  {
    title: "Get to work",
    description: "Add your first records and run your operations from day one.",
    icon: RocketIcon,
  },
];

/** Sample figures for the static product shot */
const previewStats = [
  { label: "Outstanding", value: "$18,420" },
  { label: "Overdue", value: "$4,950" },
  { label: "Paid this month", value: "$32,180" },
];

const previewInvoices = [
  {
    client: "Northwind Traders",
    number: "INV-0048",
    amount: "$4,200.00",
    status: "sent",
  },
  {
    client: "Halcyon Labs",
    number: "INV-0047",
    amount: "$12,750.00",
    status: "draft",
  },
  {
    client: "Brightline Studio",
    number: "INV-0046",
    amount: "$2,450.00",
    status: "overdue",
  },
  {
    client: "Cobalt & Pine",
    number: "INV-0045",
    amount: "$8,900.00",
    status: "paid",
  },
];

const startSignIn = () =>
  signIn({
    redirectUrl: BASE_URL,
    providerId: "omni",
  });

/** Static, non-interactive mini dashboard shown beside the hero copy */
const ProductShot = () => (
  <div
    aria-hidden
    className="pointer-events-none overflow-hidden rounded-2xl bg-card shadow-2xl shadow-primary-900/15 select-none dark:border dark:border-border/60 dark:shadow-none"
  >
    <div className="flex h-8 items-center gap-1.5 border-b border-border bg-muted px-3">
      <span className="size-2.5 rounded-full bg-input" />
      <span className="size-2.5 rounded-full bg-input" />
      <span className="size-2.5 rounded-full bg-input" />
    </div>

    <div className="grid gap-3 p-3 sm:p-4">
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {previewStats.map((stat) => (
          <div
            key={stat.label}
            className="min-w-0 rounded-xl border border-border px-2.5 py-2 sm:px-3 sm:py-2.5"
          >
            <p className="text-xs leading-tight text-muted-foreground">
              {stat.label}
            </p>
            <p className="tabular mt-0.5 text-base font-bold tracking-tight sm:text-lg">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
        {previewInvoices.map((invoice) => (
          <li
            key={invoice.number}
            className="flex min-h-12 items-center gap-3 px-3 py-2 sm:px-4"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{invoice.client}</p>
              <p className="tabular text-xs text-muted-foreground">
                {invoice.number}
              </p>
            </div>
            <span className="tabular text-sm font-medium">
              {invoice.amount}
            </span>
            <StatusBadge status={invoice.status} />
          </li>
        ))}
      </ul>
    </div>
  </div>
);

function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-10 pb-10 sm:px-6 md:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14 lg:pt-20">
        <div>
          <h1 className="text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Business operations,{" "}
            <span className="text-primary">forged under pressure</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            People, invoices, quotes, and inventory in one bedrock platform.
            Free and open source, with your records in one place instead of four
            tools.
          </p>

          <div className="mt-7 flex flex-wrap gap-2.5">
            <Button size="lg" className="group" onClick={startSignIn}>
              Get started free
              <ArrowRightIcon className="transition-transform group-hover:translate-x-0.5" />
            </Button>
            {/* A plain link (full page load), so the demo always starts fresh */}
            <a
              href={DEMO_PATH}
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              <PlayIcon />
              Try the demo
            </a>
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            Early access. Join the{" "}
            <a
              href={appConfig.organization.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              Discord
            </a>{" "}
            to help shape it.
          </p>
        </div>

        <ProductShot />
      </section>

      {/* Modules */}
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-16 sm:px-6 md:pb-20">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Four modules, one ledger
        </h2>
        <p className="mt-2 text-base text-muted-foreground">
          Quotes and invoices pick their client from your contacts, and an
          accepted quote becomes an invoice without retyping a line.
        </p>

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {modules.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="rounded-2xl bg-card p-5 shadow-card dark:border dark:border-border/60 dark:shadow-none"
            >
              <span className="mb-3.5 flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary-600 dark:text-primary-300">
                <Icon className="size-4.5" />
              </span>
              <h3 className="text-base font-semibold">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 md:pb-20">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Up and running in minutes
        </h2>
        <p className="mt-2 text-base text-muted-foreground">
          No setup project, no migration. Sign in and start.
        </p>

        <ol className="mt-7 grid gap-4 md:grid-cols-3">
          {steps.map(({ title, description, icon: Icon }, index) => (
            <li
              key={title}
              className="flex gap-4 rounded-2xl bg-card p-5 shadow-card dark:border dark:border-border/60 dark:shadow-none"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-600 dark:text-primary-300">
                <Icon className="size-4.5" />
              </span>
              <div>
                <h3 className="text-base font-semibold">
                  <span className="tabular text-muted-foreground">
                    {index + 1}.
                  </span>{" "}
                  {title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Open source + final CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 md:pb-24">
        <div className="flex flex-col items-start gap-8 rounded-3xl bg-card p-6 shadow-card sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12 dark:border dark:border-border/60 dark:shadow-none">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to build on bedrock?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {appConfig.name} is open source. Inspect the code, contribute
              features, or self-host it on your own infrastructure. No credit
              card required.
            </p>
          </div>

          <div className="flex w-full flex-wrap gap-2.5 sm:w-auto">
            <Button
              size="lg"
              className="group max-sm:flex-1"
              onClick={startSignIn}
            >
              Get started free
              <ArrowRightIcon className="transition-transform group-hover:translate-x-0.5" />
            </Button>
            <a
              href={appConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "max-sm:flex-1",
              })}
            >
              <GithubIcon />
              View on GitHub
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
