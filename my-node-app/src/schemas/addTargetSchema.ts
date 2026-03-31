import { z } from "zod";

export const addTargetSchema = z.object({
    target_id: z.number().optional(),
    title: z.string().min(1, "Target title is required"),
    description: z.string().min(1, "Target description is required"),

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
    owner_id: z.number().int().positive("Owner is required"),
    userIds: z.array(z.number().positive("Invalid user ID")).optional(),

}).superRefine((data, ctx) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end <= start) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "End date must be greater than start date",
            path: ["endDate"],
        });
    }
});

export type AddTargetDTO = z.infer<typeof addTargetSchema>;
