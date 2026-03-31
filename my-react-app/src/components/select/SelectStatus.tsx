import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { getStatusIcon } from "@/utils/getStatusIcon";
const selectItemCustom = "py-3 data-[highlighted]:text-blue-500 hover:cursor-pointer";

type StatusOption = {
    id: string | number;
    status_name: string;
}

interface SelectStatusProps {
    value?: string;
    onValueChange: (value: string) => void;
    options?: StatusOption[];
    placeholder?: string;
    label?: string;
}

export function SelectStatus({
    value,
    onValueChange,
    options,
    placeholder = "Select Status",
    label = "Select Task Status",
}: SelectStatusProps) {
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
                                {getStatusIcon(String(option.id))}
                                {option.status_name}
                            </span>
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}