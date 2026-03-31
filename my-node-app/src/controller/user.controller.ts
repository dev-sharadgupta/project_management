import { Request, Response } from "express";
import userModel from "../model/user.model";

// Get the All User
const getAllUsers = async (req: Request, res: Response) => {
    const response = await userModel.getAllUsers();
    if (response.success) {
        res.status(200).json(response);
    } else {
        res.status(500).json(response);
    }
}

const UserController = {
    getAllUsers,
};

export default UserController;