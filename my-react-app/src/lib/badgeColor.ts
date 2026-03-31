export const projectStatusColorMap: Record<number, string> = {
  1: "bg-gray-100 text-gray-700",       // e.g. Yet to Start
  2: "bg-blue-100 text-blue-600",       // e.g. In Progress
  3: "bg-green-100 text-green-500",      // e.g. Completed
  4: "bg-red-100 text-red-500",        // e.g. Blocked
}

export const targetStatusColorMap: Record<string, string> = {
  1: "bg-gray-100 text-gray-700",       // e.g. Yet to Start
  2: "bg-blue-100 text-blue-600",       // e.g. In Progress
  3: "bg-green-100 text-green-500",      // e.g. Completed
  4: "bg-red-100 text-red-500",        // e.g. Blocked
}

export const targetPriorityColorMap: Record<string, string> = {
  1: "bg-gray-100 text-gray-700",       // e.g. Low Priority
  2: "bg-yellow-100 text-yellow-600",       // e.g. Medium Priority
  3: "bg-red-100 text-red-500",        // e.g. High Priority
}

export const statusTitleMap: Record<string, string> = {
  1: 'Yet to Start',
  2: 'In Progress',
  3: 'Completed',
  4: 'Blocked',
};


// Task
export const taskStatusColorMap: Record<string, string> = {
  1: "bg-gray-100 text-gray-700",       // e.g. Yet to Start
  2: "bg-blue-100 text-blue-600",       // e.g. In Progress
  3: "bg-green-100 text-green-500",      // e.g. Completed
  4: "bg-red-100 text-red-500",        // e.g. Blocked
}

export const taskPriorityColorMap: Record<string, string> = {
  1: "bg-gray-100 text-gray-700",       // e.g. Low Priority
  2: "bg-yellow-100 text-yellow-600",       // e.g. Medium Priority
  3: "bg-red-100 text-red-500",        // e.g. High Priority
}


export const targetTypeColorMap: Record<"target" | "general", string> = {
  target: "bg-gradient-to-r from-blue-100 via-indigo-50 to-purple-100 text-blue-800",
  general: "bg-gradient-to-r from-yellow-100 via-amber-50 to-orange-100 text-yellow-800",
};


export const noteTypeColorMap: Record<"Target" | "General" | "Task", string> = {
  Target: "bg-gradient-to-r from-blue-100 via-indigo-50 to-purple-100 text-blue-800",
  Task: "bg-gradient-to-r from-yellow-100 via-amber-50 to-orange-100 text-yellow-800",
  General: "bg-gradient-to-r from-gray-100 via-amber-50 to-orange-100 text-gray-800",
};
