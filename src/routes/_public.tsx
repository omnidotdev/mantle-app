import {
  SiDiscord as DiscordIcon,
  SiGithub as GithubIcon,
  SiX as XSocialIcon,
} from "@icons-pack/react-simple-icons";
import { AppFooter } from "@omnidotdev/thornberry/app-footer";
import { Badge } from "@omnidotdev/thornberry/badge";
import { Button } from "@omnidotdev/thornberry/button";
import {
  Outlet,
  createFileRoute,
  useRouteContext,
} from "@tanstack/react-router";
import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { FaLinkedin as LinkedInIcon } from "react-icons/fa6";

import signIn from "@/lib/auth/signIn";
import signOut from "@/lib/auth/signOut";
import appConfig from "@/lib/config/app.config";
import { BASE_URL } from "@/lib/config/env.config";
import cn from "@/lib/utils";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  const { session } = useRouteContext({ from: "__root__" });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Only treat the user as "signed in" if fully provisioned (has
  // identityProviderId). A session without it is a zombie session that will
  // be cleared on next navigation — don't show "Sign Out" for it
  const isAuthenticated = !!session?.user?.identityProviderId;

  const handleSignIn = async () => {
    try {
      await signIn({ redirectUrl: BASE_URL, providerId: "omni" });
    } catch (error) {
      console.error("[handleSignIn] OAuth sign-in failed:", error);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Ambient heat glow orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Primary magma glow — top right */}
        <div
          className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-primary-500/10 blur-[120px]"
          style={{ animation: "heat-pulse 8s ease-in-out infinite" }}
        />
        {/* Secondary mineral rose glow — bottom left */}
        <div
          className="absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full bg-secondary-500/5 blur-[100px]"
          style={{ animation: "heat-pulse 10s ease-in-out infinite 2s" }}
        />
        {/* Subtle deep glow — center */}
        <div
          className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-400/5 blur-[150px]"
          style={{ animation: "heat-pulse 12s ease-in-out infinite 4s" }}
        />
      </div>

      {/* Banner + header */}
      <div className="sticky top-0 z-50">
        <div className="flex w-full items-center justify-center gap-2 border-primary-500/20 border-b bg-primary-500/20 px-4 py-2 text-sm backdrop-blur-sm sm:gap-3">
          <span className="text-base-700 dark:text-base-300">
            <strong className="font-semibold">Mantle is in early access</strong>{" "}
            — help shape it!
          </span>

          <a
            href={appConfig.organization.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-primary-500/20 px-2.5 py-0.5 font-medium text-primary-700 text-xs transition-colors hover:bg-primary-500/30 dark:text-primary-300"
          >
            <DiscordIcon className="size-3" />
            Discord
          </a>
        </div>

        <header className="w-full border-border border-b bg-background/80 backdrop-blur-lg">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">🌋</span>
              <span className="font-bold text-xl tracking-tight">
                {appConfig.name}
              </span>
              <Badge className="hidden border-primary-500/20 bg-primary-500/10 text-shimmer text-xs sm:inline-flex">
                Early Access
              </Badge>
            </a>

            {/* Desktop nav */}
            <div className="hidden items-center gap-3 md:flex">
              <a
                href={appConfig.links.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md px-3 py-2 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
              >
                Docs
              </a>
              <a
                href={appConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md px-3 py-2 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
              >
                GitHub
              </a>

              {isAuthenticated ? (
                <Button variant="outline" onClick={signOut}>
                  Sign Out
                </Button>
              ) : (
                <Button onClick={handleSignIn}>Sign In</Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <XIcon className="size-5" />
                ) : (
                  <MenuIcon className="size-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={cn(
              "border-border border-t bg-background md:hidden",
              mobileMenuOpen ? "block" : "hidden",
            )}
          >
            <div className="space-y-1 px-4 py-3">
              <a
                href={appConfig.links.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-md px-3 py-2 font-medium text-muted-foreground text-sm hover:bg-accent hover:text-foreground"
              >
                Docs
              </a>
              <a
                href={appConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-md px-3 py-2 font-medium text-muted-foreground text-sm hover:bg-accent hover:text-foreground"
              >
                GitHub
              </a>
              <div className="pt-2">
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    onClick={signOut}
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                ) : (
                  <Button onClick={handleSignIn} className="w-full">
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Main content */}
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <AppFooter
        className="relative z-10 border-border border-t bg-muted/50 py-8 backdrop-blur-sm"
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
