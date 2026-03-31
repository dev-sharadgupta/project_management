/* Make Assignee Interface */
export interface ProjectAssignee {
    id: number;
    full_name: string;
    image: string | null;
    email: string;
}

/* Make Project Interface */
export interface ProjectType {
    project_id: number;
    title: string;
    summary: string;
    description: string;
    owner_name: string;
    start_date: string;
    end_date: string;
    project_status: number;
    status_name: string;
    owner_id: number;
    owner_pic: string;
    assignees: ProjectAssignee[];
}
