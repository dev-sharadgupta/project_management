import { Request, Response } from "express";
import targetModel from "../model/target.model";
import { addTargetSchema } from "../schemas/addTargetSchema";

const getAllTargetPriorities = async (req: Request, res: Response) => {

    const response = await targetModel.getAllTargetPriorities();

    // Return the response 
    res.status(response.success ? 200 : 500).json(response);
};

const getAllTargetStatus = async (req: Request, res: Response) => {

    const response = await targetModel.getAllTargetStatus();

    // Return the response 
    res.status(response.success ? 200 : 500).json(response);
};

const addUpdateTarget = async (req: Request, res: Response) => {
    const parsed = addTargetSchema.safeParse(req.body.data);

    if (!parsed.success) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: parsed.error.flatten(),
        });
        return;
    }

    const response = await targetModel.addUpdateTarget(parsed.data);

    // Return the response 
    res.status(response.success ? 200 : 500).json(response);
}

const getProjectsTargets = async (req: Request, res: Response) => {
    const projectId = Number(req.query.project_id); //  get from query param

    if (!projectId) {
        res.status(400).json({ success: false, message: "Invalid project_id" });
        return;
    }

    const response = await targetModel.getProjectsTargets(projectId);

    // Return the response 
    res.status(response.success ? 200 : 500).json(response);
};

const getTargetsUser = async (req: Request, res: Response) => {
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

    const response = await targetModel.getTargetsUser(projectId, ownerId);

    // Return the response 
    res.status(response.success ? 200 : 500).json(response);
};

const TargetController = {
    getAllTargetPriorities,
    getAllTargetStatus,
    addUpdateTarget,
    getProjectsTargets,
    getTargetsUser,
};

export default TargetController;