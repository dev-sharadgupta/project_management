import {
    Command,
    CommandInput,
    CommandItem,
    CommandList,
    CommandEmpty,
    CommandGroup,
} from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
const selectItemCustom = cn(
    "py-2 pl-4 pr-2 flex items-center gap-2 cursor-pointer",
    "hover:bg-accent hover:text-accent-foreground",
    "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
);

const selectItemCustomSelected =
    "py-5 cursor-pointer data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&[data-selected=true]]:font-normal text-base [&]:font-normal text-sm";


type TargetOption = {
    id: string | number;
    title: string;
};

interface CustomComboboxSelectProps {
    value?: string | number;
    onValueChange: (value: string | number) => void;
    options?: TargetOption[];
    placeholder?: string;
    error?: boolean;
    className?: string;
    popoverClassName?: string;
    disabled?: boolean;
    clearable?: boolean;
}

export function CustomComboboxSelect({
    value,
    onValueChange,
    options = [],
    placeholder,
    error = false,
    className,
    popoverClassName,
    disabled = false, // Default false
    clearable = false, // Default false
}: CustomComboboxSelectProps) {
    const safeOptions = Array.isArray(options) ? options : [];

    const selectedItem = safeOptions.find(
        (option) => option.id === value || String(option.id) === String(value)
    );

    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(selectItemCustomSelected, "flex justify-between items-center", error && "border-red-500", className)}
                    disabled={disabled} // Disables the trigger 
                >
                    <span className="truncate text-left">
                        {selectedItem?.title || placeholder}
                    </span>
                    {selectedItem && clearable && !disabled && (
                        <div
                            className="ml-2 h-3 w-3 cursor-pointer"
                            style={{ pointerEvents: 'all' }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onValueChange('');
                            }}
                        >
                            <X className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                        </div>
                    )}
                    <ChevronsUpDown className="ml-auto opacity-30" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="center"
                sideOffset={0}
                className={cn("p-0 overflow-auto min-w-[250px]", popoverClassName)}
                style={{ width: "var(--radix-popover-trigger-width)" }}
            >
                <Command>
                    <CommandInput placeholder="Search target..." />
                    <CommandEmpty>No targets found.</CommandEmpty>
                    <CommandList>
                        <CommandGroup>
                            {safeOptions.map((option) => (
                                <CommandItem
                                    key={option.id}
                                    onSelect={() => {
                                        onValueChange(option.id);
                                        setOpen(false);
                                    }}
                                    className={selectItemCustom}
                                >
                                    <Check
                                        className={cn(
                                            "h-4 w-4",
                                            value?.toString() === option.id.toString() ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="mr-auto">
                                        {option.title}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
