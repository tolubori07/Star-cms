import { Collection, Project } from "@prisma/client";
import React from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

type Props = {
  projects: (Project & { collections: Collection[] })[];
};

const NavProjects = ({ projects }: Props) => {
  return (
    <SidebarGroup>
      <Link href={'/dashboard'}><SidebarGroupLabel>Projects</SidebarGroupLabel></Link>
      <SidebarMenu>
        {projects.map((project) => (
          <Collapsible key={project.id} asChild className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={project.name}>
                  <Link href={`/projects/${project.id}`}><span>{project.name}</span></Link>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {project.collections?.map((collection) => (
                    <SidebarMenuSubItem key={collection.id}>
                      <SidebarMenuSubButton asChild>
                        <Link href={`/collections/${collection.id}`}>
                          <span>{collection.name}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavProjects;

