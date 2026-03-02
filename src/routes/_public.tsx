import {
  Outlet,
  createFileRoute,
  useRouteContext,
} from "@tanstack/react-router";
import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { LuGithub as GithubIcon } from "react-icons/lu";
import {
  SiDiscord as DiscordIcon,
  SiLinkedin as LinkedinIcon,
  SiX as XIcon2,
} from "react-icons/si";

import { Button } from "@/components/ui/button";
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

  const handleSignIn = async () => {
    try {
      await signIn({ redirectUrl: BASE_URL, providerId: "omni" });
    } catch (error) {
      console.error("[handleSignIn] OAuth sign-in failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-gray-200 border-b bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl">🪨</span>
            <span className="font-bold text-xl tracking-tight">
              {appConfig.name}
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden items-center gap-3 md:flex">
            <a
              href={appConfig.links.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-3 py-2 font-medium text-gray-600 text-sm hover:text-gray-900"
            >
              Docs
            </a>
            <a
              href={appConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-3 py-2 font-medium text-gray-600 text-sm hover:text-gray-900"
            >
              GitHub
            </a>

            {session ? (
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
            "border-gray-200 border-t bg-white md:hidden",
            mobileMenuOpen ? "block" : "hidden",
          )}
        >
          <div className="space-y-1 px-4 py-3">
            <a
              href={appConfig.links.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-md px-3 py-2 font-medium text-gray-600 text-sm hover:bg-gray-100 hover:text-gray-900"
            >
              Docs
            </a>
            <a
              href={appConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-md px-3 py-2 font-medium text-gray-600 text-sm hover:bg-gray-100 hover:text-gray-900"
            >
              GitHub
            </a>
            <div className="pt-2">
              {session ? (
                <Button variant="outline" onClick={signOut} className="w-full">
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

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-gray-200 border-t bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-xl opacity-60">🪨</span>
              <span className="text-gray-500 text-sm">
                Made by{" "}
                <a
                  href={appConfig.organization.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 transition-colors hover:text-teal-600"
                >
                  {appConfig.organization.name}
                </a>
              </span>
            </div>

            <div className="flex items-center gap-6">
              <a
                href={appConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <GithubIcon size={20} />
              </a>
              <a
                href={appConfig.organization.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <DiscordIcon size={20} />
              </a>
              <a
                href={appConfig.organization.x}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <XIcon2 size={20} />
              </a>
              <a
                href={appConfig.organization.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <LinkedinIcon size={20} />
              </a>
            </div>

            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()}{" "}
              <a
                href={appConfig.organization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900"
              >
                {appConfig.organization.name}
              </a>
              . All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
