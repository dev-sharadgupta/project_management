import { getPriorityIcon } from "@/utils/getPriorityIcon";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
const selectItemCustom = "py-3 data-[highlighted]:text-blue-500 hover:cursor-pointer";

type PriorityOption = {
    id: string | number;
    priority_name: string;
}

interface SelectPriorityProps {
    value?: string;
    onValueChange: (value: string) => void;
    options?: PriorityOption[];
    placeholder?: string;
    label?: string;
}

export function SelectPriority({
    value,
    onValueChange,
    options,
    placeholder = "Select priority level",
    label = "Select Task Priority",
}: SelectPriorityProps) {
    return (
        <Select
            value={value} onValueChange={onValueChange}
        >
            <SelectTrigger className="w-full hover:cursor-pointer px-4 py-5 border rounded-md">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="text-lg py-1">
                <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {options?.map((option) => (
                        <SelectItem
                            key={option.id}
                            className={selectItemCustom}
                            value={String(option.id)}
                        >
                            <span className="flex items-center gap-2">
                                {getPriorityIcon(String(option.id))}
                                {option.priority_name}
                            </span>
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
