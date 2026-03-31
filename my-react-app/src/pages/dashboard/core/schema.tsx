import { z } from "zod";

/* Create Project */
export const createProjectSchema = z.object({
    title: z.string()
        .min(1, "Project title is required"),
    summary: z.string()
        .min(1, "Project summary is required"),
    description: z.string()
        .min(1, "Project description is required"),
    startDate: z.date({
        required_error: "Start date is required",
        invalid_type_error: "Please select a valid start date",
    }),
    endDate: z.date({
        required_error: "End date is required",
        invalid_type_error: "Please select a valid end date",
    }),
    ownerId: z.number({
        required_error: "Project owner is required",
    }).positive("Invalid owner selected"),
    userIds: z.array(z.number().positive("Invalid user ID")).optional(),
}).superRefine((data, ctx) => {
    // Only validate if both dates are present and valid
    if (data.startDate && data.endDate) {
        if (data.endDate <= data.startDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "End date must be greater than start date",
                path: ["endDate"],
            });
        }
    }
});
// Type inference
export type CreateProjectFormData = z.infer<typeof createProjectSchema>;


/* Add Target */
export const addTargetSchema = z.object({
    title: z.string()
        .min(1, "Target title is required"),
    description: z.string()
        .min(1, "Target description is required"),
    priority: z.string().min(1, "Priority must be selected"),
    status: z.string().min(1, "Status must be selected"),
    startDate: z.date({
        required_error: "Start date is required",
        invalid_type_error: "Please select a valid start date",
    }),
    endDate: z.date({
        required_error: "End date is required",
        invalid_type_error: "Please select a valid end date",
    }),
    ownerId: z.number({
        required_error: "Project owner is required",
    }).positive("Invalid owner selected"),
    userIds: z.array(z.number().positive("Invalid user ID")).optional(),
}).superRefine((data, ctx) => {
    // Only validate if both dates are present and valid
    if (data.startDate && data.endDate) {
        if (data.endDate <= data.startDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "End date must be greater than start date",
                path: ["endDate"],
            });
        }
    }
});
export type AddTargetFormData = z.infer<typeof addTargetSchema>;


/* Add Task */
export const addTaskSchema = z.object({
    target_id: z.number().optional(),
    title: z.string()
        .min(1, "Task title is required"),
    description: z.string()
        .min(1, "Task description is required"),
    priority: z.string().min(1, "Priority must be selected"),
    status: z.string().min(1, "Status must be selected"),
    startDate: z.date({
        required_error: "Start date is required",
    }),
    endDate: z.date({
        required_error: "End date is required",
    }),
    userIds: z.array(z.number().positive("Invalid Assignee Id")).optional(),
})
    .superRefine((data, ctx) => {
        if (data.startDate && data.endDate && data.endDate <= data.startDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "End date must be greater than start date",
                path: ["endDate"],
            });
        }
    });


export type AddTaskFormData = z.infer<typeof addTaskSchema>;


/* Add Note */
export const addNoteSchema = z.object({
    target_id: z.number().optional(),
    task_id: z.number().optional(),
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    tags: z.array(z.number()).optional(),
});
export type AddNoteFormData = z.infer<typeof addNoteSchema>;





