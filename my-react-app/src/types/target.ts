export type TargetAssignee = {
    id: number;
    name: string;
    avatar: string;
    bgColor?: string;
};

export type TargetType = {
    id: number;
    title: string;
    description: string;
    start_date: string;
    due_date: string;
    priority_id: number;
    priority_name: string;
    status_id: number;
    status_name: string;
    status_color: string;
    assignees: TargetAssignee[];
    owner_id: number;
    owner_name: string;
    owner_avatar: string;
};

export type TargetPriorityType = {
    id: number;
    priority_name: string;
};

export type TargetStatusType = {
    id: number;
    status_name: string;
};