import { z } from "zod";

export const addNoteSchema = z.object({
    note_id: z.number().int().positive().optional(),
    project_id: z.number().int().positive("Project ID is required"),
    target_id: z.number().int().positive().optional(),
    task_id: z.number().int().positive().optional(),
    note_type: z.enum(['General', 'Target', 'Task']).optional(),
    title: z.string().min(1, "Note title is required"),
    content: z.string().min(1, "Note content is required"),
    parent_id: z.number().int().positive().optional(),
    tags: z.array(z.number().positive("Invalid Tags ID")).optional(),
})
export type AddNoteDTO = z.infer<typeof addNoteSchema>;
