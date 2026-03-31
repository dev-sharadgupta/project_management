import { Request, Response } from "express";
import projectModel from "../model/project.model"
import { createProjectSchema } from "../schemas/createProjectSchema";

const getProjects = async (req: Request, res: Response) => {
    const response = await projectModel.getProjects();

    // Return the response 
    res.status(response.success ? 200 : 500).json(response);
};

const createProject = async (req: Request, res: Response) => {
    const parsed = createProjectSchema.safeParse(req.body.data);

    if (!parsed.success) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: parsed.error.flatten(),
        });
        return;
    }

    const response = await projectModel.createProject(parsed.data);

    // Return the response 
    res.status(response.success ? 200 : 500).json(response);
}

const getProjectUnassignedUsers = async (req: Request, res: Response) => {
    const projectId = Number(req.query.project_id); //  get from query param

    if (!projectId) {
        res.status(400).json({ success: false, message: "Invalid project_id" });
        return;
    }

    const response = await projectModel.getProjectUnassignedUsers(projectId);

    // Return the response 
    res.status(response.success ? 200 : 500).json(response);
};

const getProjectAvailableUsers = async (req: Request, res: Response) => {
    const projectId = Number(req.query.project_id); //  get from query param

    if (!projectId) {
        res.status(400).json({ success: false, message: "Invalid project_id" });
        return;
    }

    const response = await projectModel.getProjectAvailableUsers(projectId);

    // Return the response 
    res.status(response.success ? 200 : 500).json(response);
};

// Save Project Users
const saveProjectUsers = async (req: Request, res: Response) => {
    const postData = req.body.data;

    if (!postData || !Array.isArray(postData)) {
        res.status(400).json({ success: false, message: "Invalid data" });
        return;
    }

    const response = await projectModel.saveProjectUsers(postData);

    // Return the response 
    res.status(response.success ? 200 : 500).json(response);

}


// Get the Project Assignee
const getProjectAssignedUsers = async (req: Request, res: Response) => {
    const projectId = Number(req.query.project_id); //  get from query param

    if (!projectId) {
        res.status(400).json({ success: false, message: "Invalid project_id" });
        return;
    }

    const response = await projectModel.getProjectAssignedUsers(projectId);

    // Return the response 
    res.status(response.success ? 200 : 500).json(response);
}

// Remove All User from Project
const removeAllProjectUsers = async (req: Request, res: Response) => {
    const projectId = Number(req.body.project_id); //  get from query param

    if (!projectId) {
        res.status(400).json({ success: false, message: "Invalid project_id" });
        return;
    }

    const response = await projectModel.removeAllProjectUsers(projectId);

    // Return the response 
    res.status(response.success ? 200 : 500).json(response);
};

const ProjectController = {
    getProjects,
    createProject,
    getProjectUnassignedUsers,
    getProjectAvailableUsers,
    saveProjectUsers,
    getProjectAssignedUsers,
    removeAllProjectUsers,
};

export default ProjectController;