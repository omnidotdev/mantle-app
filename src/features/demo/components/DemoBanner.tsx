import { ArrowRightIcon, InfoIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import signIn from "@/lib/auth/signIn";
import { BASE_URL } from "@/lib/config/env.config";

const getStarted = async () => {
  try {
    await signIn({ redirectUrl: BASE_URL, providerId: "omni" });
  } catch (error) {
    console.error("[DemoBanner] sign-in failed:", error);
  }
};

/**
 * Notice across the top of every demo page: the workspace is sample data,
 * changes stay in the browser until a reload, and the way to a real one
 */
const DemoBanner = () => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-primary/15 bg-primary/10 px-4 py-2 text-sm md:px-8 print:hidden">
    <p className="flex min-w-0 flex-1 basis-64 items-start gap-2 text-foreground/80">
      <InfoIcon
        aria-hidden
        className="mt-0.5 size-4 shrink-0 text-primary-600 dark:text-primary-300"
      />
      <span>
        <strong className="font-semibold text-foreground">
          You're viewing a demo with sample data.
        </strong>
        <span className="hidden sm:inline">
          {" "}
          Changes stay in this browser and reset when you reload.
        </span>
      </span>
    </p>

    <div className="flex items-center gap-2">
      {/* A full page load, so the sample data is dropped on the way out */}
      <a href="/" className={buttonVariants({ variant: "ghost", size: "sm" })}>
        Exit demo
      </a>
      <Button size="sm" className="group" onClick={getStarted}>
        Get started free
        <ArrowRightIcon className="transition-transform group-hover:translate-x-0.5" />
      </Button>
    </div>
  </div>
);

export default DemoBanner;
