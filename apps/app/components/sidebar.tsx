"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/design-system/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@repo/design-system/components/ui/sidebar";
import {
  ChevronRightIcon,
  Clock2Icon,
  DollarSignIcon,
  DoorOpenIcon,
  HeartIcon,
  KeyIcon,
  LibraryIcon,
  LifeBuoyIcon,
  SendIcon,
  SquareTerminalIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

type GlobalSidebarProperties = {
  readonly children: ReactNode;
};

type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType;
  isActive?: boolean;
  items?: { title: string; url: string }[];
};

const Logo = () => (
  <svg
    width="23"
    height="25"
    className="fill-foreground w-4 h-4"
    viewBox="0 0 23 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.06583e-07 4.24978L0 0H4.73887V4.24978H2.06583e-07Z"
      fill="inherit"
    />
    <path
      d="M8.70093 9.23462V4.98486H13.4398V9.23462H8.70093Z"
      fill="inherit"
    />
    <path
      d="M17.4023 14.1319V9.88208H22.1412V14.1319H17.4023Z"
      fill="inherit"
    />
    <path
      d="M8.70093 19.0916V14.8418H13.4398V19.0916H8.70093Z"
      fill="inherit"
    />
    <path
      d="M2.06583e-07 24.0523L0 19.8025H4.73887V24.0523H2.06583e-07Z"
      fill="inherit"
    />
    <path
      d="M2.06583e-07 14.1319L0 9.88208H4.73887V14.1319H2.06583e-07Z"
      fill="inherit"
    />
  </svg>
);

export const GlobalSidebar = ({ children }: GlobalSidebarProperties) => {
  const _sidebar = useSidebar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pipeline = searchParams.get("pipeline");

  const data: {
    navMain: NavItem[];
    navSettings: NavItem[];
    navSecondary: NavItem[];
  } = {
    navMain: [
      {
        title: "Create Pipeline",
        url: `?pipeline=${pipeline}&tab=create`,
        icon: SquareTerminalIcon,
        isActive: true,
      },
      {
        title: "Liked Pipelines",
        url: `?pipeline=${pipeline}&tab=liked`,
        icon: HeartIcon,
      },
      {
        title: "History",
        url: `?pipeline=${pipeline}&tab=history`,
        icon: Clock2Icon,
      },
      {
        title: "My Pipelines",
        url: `?pipeline=${pipeline}&tab=my`,
        icon: LibraryIcon,
      },
    ],
    navSettings: [
      {
        title: "Credits & Billing",
        url: `?pipeline=${pipeline}&billing=true`,
        icon: DollarSignIcon,
      },
      {
        title: "Gateway",
        url: `?pipeline=${pipeline}&gateway=true`,
        icon: DoorOpenIcon,
      },
      {
        title: "API Keys",
        url: `?pipeline=${pipeline}&tab=api-keys`,
        icon: KeyIcon,
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoyIcon,
      },
      {
        title: "Feedback",
        url: "#",
        icon: SendIcon,
      },
    ],
  };

  return (
    <>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center justify-between mt-4 ml-2">
            {_sidebar.open ? (
              <svg
                width="112"
                height="15"
                className="fill-foreground"
                viewBox="0 0 112 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.06025e-07 3.66664L0 1.23438H2.43227L2.43227 3.66664H1.06025e-07Z"
                  fill="inherit"
                />
                <path
                  d="M4.46875 6.51039V4.07812H6.90102L6.90102 6.51039H4.46875Z"
                  fill="inherit"
                />
                <path
                  d="M8.92969 9.3307V6.89844H11.362V9.3307H8.92969Z"
                  fill="inherit"
                />
                <path
                  d="M4.46875 12.1666V9.73438H6.90102L6.90102 12.1666H4.46875Z"
                  fill="inherit"
                />
                <path
                  d="M1.06025e-07 14.9948L0 12.5625H2.43227L2.43227 14.9948H1.06025e-07Z"
                  fill="inherit"
                />
                <path
                  d="M1.06025e-07 9.3307L0 6.89844H2.43227L2.43227 9.3307H1.06025e-07Z"
                  fill="inherit"
                />
                <path
                  d="M18.6562 13.7634V0H21.3274V11.4023H29.1571V13.7634H18.6562Z"
                  fill="inherit"
                />
                <path
                  d="M30.7448 13.7634V0H33.416V13.7634H30.7448Z"
                  fill="inherit"
                />
                <path
                  d="M45.7658 0H48.6983L43.5011 13.7634H40.0363L34.7229 0H37.7135L41.8267 10.98L45.7658 0Z"
                  fill="inherit"
                />
                <path
                  d="M50.0633 13.7634V8.08978H52.7345V5.67147H50.0633V0H60.5642V2.36109H52.7345V5.67147H59.3738V8.08978H52.7345V11.4023H60.7674V13.7634H50.0633Z"
                  fill="inherit"
                />
                <path
                  d="M62.7712 13.7634V0H69.0137C71.7139 0 73.4754 1.35875 73.4754 4.07112C73.4754 6.48082 71.7139 8.10421 69.0137 8.10421H65.4424V13.7634H62.7712ZM65.4424 5.65728H68.7137C70.0686 5.65728 70.7945 5.00715 70.7945 4.04251C70.7945 3.00411 70.0686 2.36109 68.7137 2.36109H65.4424V5.65728Z"
                  fill="inherit"
                />
                <path
                  d="M75.3049 13.7634V8.08978H77.9761V5.67147H75.3049V0H85.8058V2.36109H77.9761V5.67147H84.6154V8.08978H77.9761V11.4023H86.0091V13.7634H75.3049Z"
                  fill="inherit"
                />
                <path
                  d="M88.0129 13.7634V8.08978H90.684V5.67147H88.0129V0H98.5137V2.36109H90.684V5.67147H97.3233V8.08978H90.684V11.4023H98.717V13.7634H88.0129Z"
                  fill="inherit"
                />
                <path
                  d="M100.721 13.7634V0H107.166C109.609 0.000499947 111.425 1.18702 111.425 3.42842C111.425 5.13588 110.651 6.17432 109.063 6.75979C110.505 6.75979 111.222 7.41244 111.222 8.70816V13.7634H108.55V9.37042C108.55 8.38183 108.26 8.0939 107.263 8.0939H103.392V13.7634H100.721ZM103.392 5.66634H106.373C107.931 5.66634 108.744 5.15023 108.744 4.02295C108.744 2.89568 107.96 2.36109 106.373 2.36109H103.392V5.66634Z"
                  fill="inherit"
                />
              </svg>
            ) : (
              <Logo />
            )}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Pipelines</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => {
                        router.replace(item.url);
                      }}
                      asChild
                      tooltip={item.title}
                    >
                      <div>
                        <item.icon />
                        <span>{item.title}</span>
                      </div>
                    </SidebarMenuButton>
                    {item.items?.length ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuAction className="data-[state=open]:rotate-90">
                            <ChevronRightIcon />
                            <span className="sr-only">Toggle</span>
                          </SidebarMenuAction>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <a href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarMenu>
              {data.navSettings.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => {
                        router.replace(item.url);
                      }}
                      asChild
                      tooltip={item.title}
                    >
                      <div>
                        <item.icon />
                        <span>{item.title}</span>
                      </div>
                    </SidebarMenuButton>
                    {item.items?.length ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuAction className="data-[state=open]:rotate-90">
                            <ChevronRightIcon />
                            <span className="sr-only">Toggle</span>
                          </SidebarMenuAction>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <a href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navSecondary.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </>
  );
};
