import { Badge } from "@omnidotdev/thornberry/badge";

import MantleLogo from "@/components/core/MantleLogo";
import WorkspaceSwitcher from "@/components/core/WorkspaceSwitcher";
import { SidebarHeader } from "@/components/ui/sidebar";
import app from "@/lib/config/app.config";

const AppSidebarHeader = () => (
  <SidebarHeader className="gap-3 px-2 pt-3">
    {/* App branding */}
    <div className="flex items-center gap-2 px-2 py-1">
      <MantleLogo className="h-5 text-primary-500" />
      <span className="truncate text-[0.9375rem] font-bold tracking-tight group-data-[collapsible=icon]:hidden">
        {app.name}
      </span>
      <Badge className="border-primary/20 bg-primary/10 text-xs text-primary-600 group-data-[collapsible=icon]:hidden dark:text-primary-300">
        Early access
      </Badge>
    </div>

    <WorkspaceSwitcher />
  </SidebarHeader>
);

export default AppSidebarHeader;
