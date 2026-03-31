import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";
import { FilterIcon } from "lucide-react";

interface OptionType {
  value: string;
  label: string;
}

interface SelectFilterStatusProps {
  options: OptionType[];
  value: string;
  onChange: (value: string | null) => void;
  className?: string;
  itemClassName?: string;
}

const SelectFilterStatus = ({
  options,
  value,
  onChange,
  className = "w-auto text-xs py-1 hover:cursor-pointer",
  itemClassName = "",
}: SelectFilterStatusProps) => {
  return (
    <Select
      value={value}
      onValueChange={(val) => {
        onChange(val === "all" ? null : val);
      }}
    >
      <SelectTrigger className={className}>
        <FilterIcon />
        <span className="hidden lg:flex">
          <SelectValue placeholder="Select Status" />
        </span>
      </SelectTrigger>
      <SelectContent className="text-lg py-1">
        <SelectGroup>
          <SelectLabel>Select</SelectLabel>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className={itemClassName}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectFilterStatus;
