import { Request, Response } from "express";
import noteModel from "../model/note.model";
import { addNoteSchema } from "../schemas/addNoteSchema";

const getAllNoteTag = async (req: Request, res: Response) => {

    const response = await noteModel.getAllNoteTag();

    // Return the response 
    res.status(response.success ? 200 : 500).json(response);
};


const addUpdateNote = async (req: Request, res: Response) => {
    const parsed = addNoteSchema.safeParse(req.body.data);

    if (!parsed.success) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: parsed.error.flatten(),
        });
        return;
    }

    const response = await noteModel.addUpdateNote(parsed.data);

    // Return the response 
    res.status(response.success ? 200 : 500).json(response);
}

const getProjectsNotes = async (req: Request, res: Response) => {
    const projectId = Number(req.query.project_id); //  get from query param

    if (!projectId) {
        res.status(400).json({ success: false, message: "Invalid project_id" });
        return;
    }

    const response = await noteModel.getProjectsNotes(projectId);

    // Return the response 
    res.status(response.success ? 200 : 500).json(response);
};


const NoteController = {
    getAllNoteTag,
    addUpdateNote,
    getProjectsNotes,
};

export default NoteController;