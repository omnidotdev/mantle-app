import cn from "@/lib/utils";

import type { ComponentProps } from "react";

const widths = {
  /** Lists, dashboards, detail pages */
  default: "max-w-6xl",
  /** Single-column forms and settings */
  narrow: "max-w-3xl",
  /** Side-by-side editors (form + live document preview) */
  wide: "max-w-[96rem]",
} as const;

interface PageContainerProps extends ComponentProps<"div"> {
  width?: keyof typeof widths;
}

/**
 * Page body inside the workspace shell. Owns the page gutter and max width so
 * every route lines up, and leaves room for the phone tab bar at the bottom
 */
const PageContainer = ({
  width = "default",
  className,
  ...rest
}: PageContainerProps) => (
  <div
    className={cn(
      "mx-auto w-full px-4 pt-5 pb-36 sm:px-6 md:px-8 md:pt-7 md:pb-12 print:max-w-none print:p-0",
      widths[width],
      className,
    )}
    {...rest}
  />
);

export default PageContainer;
