import { ChevronsDown, ChevronsUp, ChevronsUpDown } from "lucide-react";

export const getPriorityIcon = (id: string) => {
    switch (id) {
        case "1":
            return <ChevronsDown className="w-4 h-4 text-gray-500" />;
        case "2":
            return <ChevronsUpDown className="w-4 h-4 text-yellow-500" />;
        case "3":
            return <ChevronsUp className="w-4 h-4 text-red-500" />;
        default:
            return <ChevronsUpDown className="w-4 h-4 text-yellow-500" />;

    }
};
