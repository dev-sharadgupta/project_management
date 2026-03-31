import { Check, ChevronsDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedProject, setAllProjects, setLoading } from "@/store/slices/projectSlice";
import API from "@/lib/axios"
import { toast } from "sonner"


export default function NavigationProject() {

    const dispatch = useAppDispatch();
    const { selectedProject, projects = [], loading } = useAppSelector((state) => state.project || {});

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!loading && Array.isArray(projects) && projects.length === 0) {
            dispatch(setLoading(true));
            fetchProjects();
        }
    }, [dispatch, loading, projects.length]);


    const fetchProjects = async () => {
        try {
            const response = await API.get('get_projects');

            if (response.data.success && Array.isArray(response.data.projects)) {
                dispatch(setAllProjects(response.data.projects));
            }
        } catch (error) {
            toast.error('Failed to fetch projects');
        }
        finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <TooltipProvider>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[170px] justify-start"
                        disabled={loading}
                    >
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="truncate w-full text-left text-sm leading-tight">
                                    {loading ? "Loading..." : (selectedProject?.title ?? "Select Project")}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent side="left" align="center">
                                <p>Switch Project</p>
                            </TooltipContent>
                        </Tooltip>
                        <ChevronsDown className="ml-auto opacity-0" />
                    </Button>
                </PopoverTrigger>
            </TooltipProvider>

            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search Project" className="h-9" />
                    <CommandList>
                        <CommandEmpty>No project found.</CommandEmpty>
                        <CommandGroup>
                            {Array.isArray(projects) && projects.map((project) => (
                                <CommandItem
                                    key={project.project_id}
                                    value={project.title}
                                    onSelect={() => {
                                        if (project.project_id !== selectedProject?.project_id) {
                                            dispatch(setSelectedProject(project));
                                        }
                                        setOpen(false);
                                    }}
                                >
                                    {project.title}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            selectedProject?.project_id === project.project_id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}