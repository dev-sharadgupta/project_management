import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"
import { Settings, User2, LayoutDashboardIcon, Goal, ListChecksIcon, NotepadText, CalendarDays, FileBarChart2Icon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { useNavigate, useSearchParams } from "react-router";
import { useIsMobile } from "@/hooks/use-mobile";
import NavigationProject from "../navigation/NavigationProject";

const items = [
    {
        title: "Overview",
        url: "overview",
        icon: LayoutDashboardIcon,
    },
    {
        title: "Targets",
        url: "targets",
        icon: Goal,
    },
    {
        title: "Tasks",
        url: "tasks",
        icon: ListChecksIcon,
    },
    {
        title: "Notes",
        url: "notes",
        icon: NotepadText,
    },
    {
        title: "Meetings",
        url: "meetings",
        icon: CalendarDays,
    },
    {
        title: "Reports",
        url: "reports",
        icon: FileBarChart2Icon,
    },
    {
        title: "Settings",
        url: "settings",
        icon: Settings,
    },
]


export function AppSidebar() {
    const [searchParams] = useSearchParams();
    const currentPage = searchParams.get("page") || "overview";
    const navigate = useNavigate();
    const { setOpenMobile } = useSidebar();
    const { open: isSidebarOpen } = useSidebar();
    const isMobile = useIsMobile();


    const handleMenuClick = (url: any) => {
        navigate(`?page=${url}`);

        // Close sidebar on mobile after navigation
        if (isMobile) { // md breakpoint
            setOpenMobile(false);
        }
    };

    return (
        <Sidebar >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className="flex flex-row-reverse items-center">
                        <TooltipProvider delayDuration={300}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <SidebarTrigger className="w-8 h-8" />
                                </TooltipTrigger>
                                <TooltipContent side="bottom" align="end" >
                                    <p>{isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <User2 className="size-4" />
                                </div>
                                <NavigationProject />
                                {/* <span className="truncate font-semibold">My Project</span> */}
                                {/* <span className="truncate text-xs">Enterprise</span> */}
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <TooltipProvider key={item.title} delayDuration={300}>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            onClick={() => handleMenuClick(item.url)}
                                            className={`flex items-center gap-2 ${currentPage === item.url ? "font-bold" : ""
                                                }`}
                                        >
                                            {/* Tooltip only wraps the icon */}
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <item.icon className="w-4 h-4" />
                                                </TooltipTrigger>
                                                <TooltipContent side="right" align="center">
                                                    {item.title}
                                                </TooltipContent>
                                            </Tooltip>

                                            {/* Text remains outside tooltip */}
                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </TooltipProvider>

                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            {/* <User2 />
                            <span>Username</span> */}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}