import { Badge } from "@omnidotdev/thornberry/badge";
import { SidebarHeader } from "@omnidotdev/thornberry/sidebar";

import WorkspaceSwitcher from "@/components/core/WorkspaceSwitcher";
import app from "@/lib/config/app.config";

const AppSidebarHeader = () => (
  <SidebarHeader>
    {/* App branding */}
    <div className="flex items-center gap-2 px-1 py-1.5">
      <span className="text-lg">🌋</span>
      <span className="truncate font-semibold text-sm group-data-[collapsible=icon]:hidden">
        {app.name}
      </span>
      <Badge className="border-primary/20 bg-primary/10 text-primary text-xs group-data-[collapsible=icon]:hidden">
        Early Access
      </Badge>
    </div>

    <WorkspaceSwitcher />
  </SidebarHeader>
);

export default AppSidebarHeader;
