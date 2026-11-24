import { Loader2Icon } from "lucide-react";

/** Centered spinner for a page or section that is still loading */
const LoadingState = ({ label = "Loading" }: { label?: string }) => (
  <div className="flex items-center justify-center py-20">
    <Loader2Icon
      className="size-7 animate-spin text-muted-foreground"
      aria-label={label}
    />
  </div>
);

export default LoadingState;
