
import { CheckCircle2, Clock, RefreshCcw } from "lucide-react";

export const getStatusIcon = (id: string) => {
    switch (id) {
        case "1":
            return <Clock className="w-4 h-4 text-gray-500" />;
        case "2":
            return <RefreshCcw className="w-4 h-4 text-blue-500" />;
        case "3":
            return <CheckCircle2 className="w-4 h-4 text-green-500" />;
        default:
            return <Clock className="w-4 h-4 text-gray-500 " />;
    }
};
