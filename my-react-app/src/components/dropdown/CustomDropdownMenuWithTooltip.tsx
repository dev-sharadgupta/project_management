import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "@/components/ui/tooltip"
import {
    type ReactNode,
    type ReactElement,
    type ElementType,
} from "react"

interface CustomDropdownMenuWithTooltipProps {
    trigger: ReactElement<any, ElementType>
    children: ReactNode
    tooltip?: string
    dropdownLabel?: string
    align?: "start" | "center" | "end"
    side: "top" | "right" | "bottom" | "left"
    sideOffset: number
    className?: string
}

export const CustomDropdownMenuWithTooltip = ({
    trigger,
    children,
    tooltip,
    dropdownLabel,
    align = "start",
    side = "bottom",
    sideOffset = 4,
    className = "w-auto",
}: CustomDropdownMenuWithTooltipProps) => {
    const wrappedTrigger = tooltip ? (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        {trigger}
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ) : (
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
    )

    return (
        <DropdownMenu>
            {wrappedTrigger}
            <DropdownMenuContent
                align={align}
                side={side}
                sideOffset={sideOffset}
                className={className}
                onClick={(e) => e.stopPropagation()}
            >
                {dropdownLabel &&
                    <div>
                        <DropdownMenuLabel>{dropdownLabel}</DropdownMenuLabel>
                        <DropdownMenuSeparator  className="my-2 py-[1px]"/>
                    </div>}
                    
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
