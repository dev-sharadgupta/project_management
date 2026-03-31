import { z } from "zod";

export const createProjectSchema = z.object({
    title: z.string().min(1, "Project title is required"),
    summary: z.string().min(1, "Project summary is required"),
    description: z.string().min(1, "Project description is required"),

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

    ownerId: z.number({
        required_error: "Project owner is required",
    }).positive("Invalid owner selected"),

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

export type CreateProjectDTO = z.infer<typeof createProjectSchema>;
