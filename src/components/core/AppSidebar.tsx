import { Sidebar } from "@omnidotdev/thornberry/sidebar";

import AppSidebarContent from "./AppSidebarContent";
import AppSidebarFooter from "./AppSidebarFooter";
import AppSidebarHeader from "./AppSidebarHeader";

import type { ComponentProps } from "react";

const AppSidebar = ({ ...props }: ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <AppSidebarHeader />
      <AppSidebarContent />
      <AppSidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
