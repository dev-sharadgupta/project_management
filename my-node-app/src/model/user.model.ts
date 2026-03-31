import { AppDataSource } from "../data-source";
import { User } from "../entity/userEntity/UserMaster";

const getAllUsers = async () => {
    try {
        const userRepo = AppDataSource.getRepository(User);
        const users = await userRepo.find({
            where: { status: 1 }
        });

        return { success: true, message: "Data Found", users };
    } catch (error) {
        return { success: false, message: 'Internal Server Error' };
    }
}



const UserModel = {
    getAllUsers,
}

export default UserModel;