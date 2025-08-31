"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import LogoutButton from "./LogoutButton";
import { Project } from "@prisma/client";
import NavProjects from "./NavProjects";
import NavModels from "./NavModels";
import { Stars } from "lucide-react";
import Link from "next/link";

type Props = {
  Projects: Project[];
};

const AppSidebarClient = ({ Projects }: Props) => {
  return (
    <Sidebar collapsible="offcanvas">
      <Link href={'/dashboard'}>
      <SidebarHeader className="flex flex-row bg-main">
        <Stars />
        <h1 className="text-2xl font-bold text-foreground">Star</h1>
      </SidebarHeader>
      </Link>
      <SidebarContent>
        {/*@ts-ignore*/}
        <NavProjects projects={Projects} />
        {/*@ts-ignore*/}
        <NavModels projects={Projects} />
      </SidebarContent>
      <SidebarFooter>
        <LogoutButton />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebarClient;
