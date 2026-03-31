export type TaskAssignee = {
    id: number;
    name: string;
    avatar: string;
    bgColor?: string;
};

export type TaskType = {
    id: number;
    title: string;
    description: string;
    start_date: string;
    due_date: string;
    priority_id: number;
    target_id: number;
    priority_name: string;
    status_id: number;
    status_name: string;
    status_color: string;
    assignees: TaskAssignee[];
};

export type TaskPriorityType = {
    id: number;
    priority_name: string;
};

export type TaskStatusType = {
    id: number;
    status_name: string;
};