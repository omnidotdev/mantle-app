import cn from "@/lib/utils";

import type { ReactNode } from "react";

/**
 * Phone-only action bar pinned to the bottom of the viewport, above the tab
 * bar. Detail and editor pages move their header actions here below `md` so
 * the main action stays in thumb reach. Never printed
 */
const MobileActionBar = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 flex items-center gap-2 border-t border-border bg-card/90 px-4 py-2.5 backdrop-blur-md md:hidden print:hidden",
      className,
    )}
  >
    {children}
  </div>
);

export default MobileActionBar;
