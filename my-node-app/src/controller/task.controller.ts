import { Request, Response } from "express";
import taskModel from "../model/task.model";
import { addTaskSchema } from "../schemas/addTaskSchema";

const getAllTaskPriorities = async (req: Request, res: Response) => {

    const response = await taskModel.getAllTaskPriorities();

    // Return the response 
    res.status(response.success ? 200 : 500).json(response);
};

const getAllTaskStatus = async (req: Request, res: Response) => {

    const response = await taskModel.getAllTaskStatus();

    // Return the response 
    res.status(response.success ? 200 : 500).json(response);
};

const addUpdateTask = async (req: Request, res: Response) => {
    const parsed = addTaskSchema.safeParse(req.body.data);

    if (!parsed.success) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: parsed.error.flatten(),
        });
        return;
    }

    const response = await taskModel.addUpdateTask(parsed.data);

    // Return the response 
    res.status(response.success ? 200 : 500).json(response);
}

const getProjectsTasks = async (req: Request, res: Response) => {
    const projectId = Number(req.query.project_id); //  get from query param

    if (!projectId) {
        res.status(400).json({ success: false, message: "Invalid project_id" });
        return;
    }

    const response = await taskModel.getProjectsTasks(projectId);

    // Return the response 
    res.status(response.success ? 200 : 500).json(response);
};

const getTasksUser = async (req: Request, res: Response) => {
    const projectId = Number(req.query.project_id); //  get from query param
    const ownerId = Number(req.query.owner_id); //  get from query param

    if (!projectId) {
        res.status(400).json({ success: false, message: "Invalid project id" });
        return;
    }
    if (!ownerId) {
        res.status(400).json({ success: false, message: "Invalid owner id" });
        return;
    }

    const response = await taskModel.getTasksUser(projectId, ownerId);

    // Return the response 
    res.status(response.success ? 200 : 500).json(response);
};

const TaskController = {
    getAllTaskPriorities,
    getAllTaskStatus,
    addUpdateTask,
    getProjectsTasks,
    getTasksUser,
};

export default TaskController;