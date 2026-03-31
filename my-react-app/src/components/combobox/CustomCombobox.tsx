import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CustomComboboxProps<T> {
    options: T[];
    value?: string | number | null;
    onChange: (val: string | number | null) => void;
    getOptionLabel?: (option: T) => string;
    getOptionValue?: (option: T) => string | number;
    placeholder?: string;
    className?: string;
}

export function CustomCombobox<T>({
    options,
    value,
    onChange,
    getOptionLabel = (opt) => (opt as any)?.label ?? "",
    getOptionValue = (opt) => (opt as any)?.value ?? "",
    placeholder = "Select option...",
    className = "w-auto",
}: CustomComboboxProps<T>) {
    const [open, setOpen] = useState(false);

    const selected = options.find(
        (opt) => getOptionValue(opt) === value
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className={cn("justify-between", className, !selected && "text-muted-foreground")}
                >
                    {selected ? getOptionLabel(selected) : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={`p-0 ${className}`}>
                <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                        {options.map((opt) => {
                            const label = getOptionLabel(opt);
                            const val = getOptionValue(opt);

                            return (
                                <CommandItem
                                    key={val}
                                    value={label}
                                    onSelect={() => {
                                        onChange(val);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn("mr-2 h-4 w-4", val === value ? "opacity-100" : "opacity-0")}
                                    />
                                    {label}
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
