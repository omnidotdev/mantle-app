import {
  SiDiscord as DiscordIcon,
  SiGithub as GithubIcon,
  SiX as XSocialIcon,
} from "@icons-pack/react-simple-icons";
import { AppFooter } from "@omnidotdev/thornberry/app-footer";
import {
  Outlet,
  createFileRoute,
  useRouteContext,
} from "@tanstack/react-router";
import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { FaLinkedin as LinkedInIcon } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import signIn from "@/lib/auth/signIn";
import signOut from "@/lib/auth/signOut";
import appConfig from "@/lib/config/app.config";
import { BASE_URL } from "@/lib/config/env.config";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  const { session } = useRouteContext({ from: "__root__" });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Only treat the user as "signed in" if fully provisioned (has
  // identityProviderId). A session without it is a zombie session that will
  // be cleared on next navigation, so don't show "Sign out" for it
  const isAuthenticated = !!session?.user?.identityProviderId;

  const handleSignIn = async () => {
    try {
      await signIn({ redirectUrl: BASE_URL, providerId: "omni" });
    } catch (error) {
      console.error("[handleSignIn] OAuth sign-in failed:", error);
    }
  };

  return (
    <div
      className="flex min-h-dvh flex-col bg-canvas"
      style={{
        // One soft warm wash behind the header and hero
        backgroundImage:
          "radial-gradient(1200px 500px at 70% -10%, color-mix(in oklch, var(--primary-300) 22%, transparent), transparent 70%)",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Early access banner */}
      <div className="border-b border-primary/15 bg-primary/10 px-4 py-2 text-center text-sm">
        <span className="text-foreground/80">
          <strong className="font-semibold text-foreground">
            {appConfig.name} is in early access.
          </strong>{" "}
          Help shape it on{" "}
          <span className="whitespace-nowrap">
            <a
              href={appConfig.organization.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary-600 underline-offset-2 hover:underline dark:text-primary-300"
            >
              <DiscordIcon className="size-3.5" aria-hidden />
              Discord
            </a>
            .
          </span>
        </span>
      </div>

      <header className="w-full">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <a
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight"
          >
            <span aria-hidden className="text-2xl">
              {appConfig.icon}
            </span>
            {appConfig.name}
          </a>

          {/* Desktop nav */}
          <nav
            aria-label="Main"
            className="ml-auto hidden items-center gap-2 md:flex"
          >
            <a
              href={appConfig.links.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Docs
            </a>
            <a
              href={appConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <GithubIcon className="size-4" />
            </a>

            {isAuthenticated ? (
              <Button variant="outline" onClick={signOut} className="ml-2">
                Sign out
              </Button>
            ) : (
              <Button onClick={handleSignIn} className="ml-2">
                Sign in
              </Button>
            )}
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="public-mobile-menu"
            className="ml-auto md:hidden"
          >
            {mobileMenuOpen ? (
              <XIcon className="size-5" />
            ) : (
              <MenuIcon className="size-5" />
            )}
          </Button>
        </div>

        {/* Mobile menu */}
        <nav
          id="public-mobile-menu"
          aria-label="Main"
          hidden={!mobileMenuOpen}
          className="px-4 pb-3 md:hidden"
        >
          <div className="space-y-1 rounded-2xl bg-card p-2 shadow-card dark:border dark:border-border/60 dark:shadow-none">
            <a
              href={appConfig.links.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center rounded-xl px-3 text-sm font-medium transition-colors hover:bg-accent"
            >
              Docs
            </a>
            <a
              href={appConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center gap-2.5 rounded-xl px-3 text-sm font-medium transition-colors hover:bg-accent"
            >
              <GithubIcon className="size-4" />
              GitHub
            </a>
            <div className="p-1 pt-2">
              {isAuthenticated ? (
                <Button variant="outline" onClick={signOut} className="w-full">
                  Sign out
                </Button>
              ) : (
                <Button onClick={handleSignIn} className="w-full">
                  Sign in
                </Button>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-1 overflow-x-clip">
        <Outlet />
      </main>

      <AppFooter
        className="border-t border-border bg-card/60 py-8"
        appSymbol={appConfig.icon}
        docsUrl={appConfig.links.docs}
        orgUrl={appConfig.organization.url}
        socials={
          <>
            <a
              href={appConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="rounded p-1.5 transition-colors hover:text-foreground"
            >
              <GithubIcon className="size-5" />
            </a>
            <a
              href={appConfig.organization.discord}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className="rounded p-1.5 transition-colors hover:text-foreground"
            >
              <DiscordIcon className="size-5" />
            </a>
            <a
              href={appConfig.organization.x}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="rounded p-1.5 transition-colors hover:text-foreground"
            >
              <XSocialIcon className="size-5" />
            </a>
            <a
              href={appConfig.organization.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="rounded p-1.5 transition-colors hover:text-foreground"
            >
              <LinkedInIcon className="size-5" />
            </a>
          </>
        }
      />
    </div>
  );
}
