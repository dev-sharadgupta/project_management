import { CheckSquare, FileText, Goal } from "lucide-react";

export const getNoteTypeIcon = (id: string) => {
    switch (id) {
        case "General":
            return <FileText className="!w-3.5 !h-3.5 text-yellow-600" />;
        case "Target":
            return <Goal className="!w-3.5 !h-3.5 text-blue-600" />;
        case "Task":
            return <CheckSquare className="!w-3.5 !h-3.5 text-green-600" />;
        default:
            return <FileText className="!w-3.5 !h-3.5 text-gray-500" />;
    }
};
