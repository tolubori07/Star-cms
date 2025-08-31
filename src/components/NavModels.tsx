// AppSidebarClient/NavModels.tsx
"use client";

import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "./ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./ui/collapsible";
import { ChevronRight, Database } from "lucide-react";
import type { Project, Collection, Model } from "@prisma/client";

type ProjectTree = Project & {
  collections: (Collection & { Model: Model[] })[];
};

export default function NavModels({
  projects,
}: {
  projects: ProjectTree[] | unknown;
}) {
  const list: ProjectTree[] = Array.isArray(projects) ? projects : [];

  return (
    <SidebarGroup>
      <Link href="/dashboard">
        <SidebarGroupLabel>
          <Database className="mr-2" />
          Models
        </SidebarGroupLabel>
      </Link>

      <SidebarMenu>
        {list.map((project) => (
          <Collapsible key={project.id} asChild className="group/collapsible">
            <SidebarMenuItem>
              {/* Project */}
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={project.name}>
                  <Link href={`/projects/${project.id}`}>
                    <span>{project.name}</span>
                  </Link>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              {/* Collections */}
              <CollapsibleContent>
                <SidebarMenuSub>
                  {project.collections?.map((collection) => (
                    <Collapsible
                      key={collection.id}
                      asChild
                      className="group/collapsible"
                    >
                      <SidebarMenuSubItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuSubButton asChild>
                            <Link href={`/collections/${collection.id}`}>
                              <span>{collection.name}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </Link>
                          </SidebarMenuSubButton>
                        </CollapsibleTrigger>

                        {/* Models under Collection */}
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {collection.Model?.map((m) => (
                              <SidebarMenuSubItem key={m.id}>
                                <SidebarMenuSubButton asChild>
                                  <Link href={`/models/${m.id}`}>
                                    <span>{m.name}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuSubItem>
                    </Collapsible>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
