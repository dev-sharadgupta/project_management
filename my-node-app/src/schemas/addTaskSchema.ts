import { z } from "zod";

export const addTaskSchema = z.object({
    task_id: z.number().optional(),
    target_id: z.number().optional(),
    title: z.string().min(1, "Task title is required"),
    description: z.string().min(1, "Task description is required"),

    priority:
        z.string().min(1, "Priority is required"),
    status:
        z.string().min(1, "Status is required"),

    startDate: z.string({
        required_error: "Start date is required"
    }).refine(val => !isNaN(Date.parse(val)), {
        message: "Please select a valid start date"
    }),

    endDate: z.string({
        required_error: "End date is required"
    }).refine(val => !isNaN(Date.parse(val)), {
        message: "Please select a valid end date"
    }),

    project_id: z.number().int().positive("Project ID is required"),
    userIds: z.array(z.number().positive("Invalid Assignee ID")).optional(),

}).superRefine((data, ctx) => {
    if (data.startDate && data.endDate && data.endDate <= data.startDate) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "End date must be greater than start date",
            path: ["endDate"],
        });
    }
});

export type AddTaskDTO = z.infer<typeof addTaskSchema>;
