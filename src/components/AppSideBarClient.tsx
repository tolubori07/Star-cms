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
import { Stars } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";

type Props = {
  Projects: Project[];
};

const AppSidebarClient = ({ Projects }: Props) => {
  return (
    <Sidebar collapsible="offcanvas" className="bg-bg">
      <Link href={"/dashboard"}>
        <SidebarHeader className="flex flex-row bg-primary">
          <Stars />
          <h1 className="text-2xl font-bold text-black">BlockForge</h1>
        </SidebarHeader>
      </Link>
      <SidebarContent className="bg-bg">
        {/*@ts-ignore*/}
        <NavProjects projects={Projects} />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-row gap-2">
          <LogoutButton />
          <ModeToggle />
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebarClient;
