export type NoteTagType = {
    id: number;
    name: string;
};

export type NoteType = {
    id: number;
    project_id: number;
    target_id: number;
    target_title: string;
    task_id: number;
    task_title: string;
    note_type: 'Target' | 'Task' | 'General';
    title: string;
    content: string;
    tags: NoteTagType[];
};