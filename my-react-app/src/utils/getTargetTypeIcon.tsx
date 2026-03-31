import { FileText, Goal } from "lucide-react";

export const getTaskTypeIcon = (type: "target" | "general") => {
    switch (type) {
        case "target":
            return <Goal className="!w-3.5 !h-3.5 text-blue-600" />;
        case "general":
            return <FileText className="!w-3.5 !h-3.5 text-yellow-600" />;
        default:
            return <FileText className="!w-3.5 !h-3.5 text-yellow-600" />;
    }
};
