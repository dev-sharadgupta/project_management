import { ProjectMasterRepo, ProjectMemberRepo, UserRepo } from "../repositories";
import { ProjectMember } from "../entity/projectEntity/ProjectMember";
import { CreateProjectDTO } from "../schemas/createProjectSchema";
import moment from "moment";
import { ProjectMaster } from "../entity/projectEntity/ProjectMaster";

const getProjects = async () => {
    try {
        const projectRows = await ProjectMasterRepo.find({
            where: { status: 1 },
            relations: ["statusInfo", "owner", "members", "members.user"],
            order: { id: "ASC" },
        });

        const projects = projectRows.map((project) => {
            const assignees = (project.members || []).map((m) => ({
                id: m.user.id,
                full_name: m.user.full_name,
                image: m.user.image,
                email: m.user.email,
            }));

            return {
                project_id: project.id,
                title: project.title,
                summary: project.summary,
                description: project.description,
                start_date: moment(project.start_date).format("DD MMM, YYYY"),
                end_date: moment(project.end_date).format("DD MMM, YYYY"),
                project_status: project.project_status,
                status_name: project.statusInfo?.status_name || "",
                owner_id: project.owner?.id || "",
                owner_name: project.owner?.full_name || "",
                owner_pic: project.owner?.image || "",
                assignees,
            };
        });

        return { success: true, message: "Data Found", projects };
    } catch (error) {
        console.error("getProjects error:", error);
        return { success: false, message: "Internal Server Error" };
    }
};

const createProject = async (data: CreateProjectDTO) => {
    try {
        const newProject = ProjectMasterRepo.create({
            title: data.title,
            summary: data.summary,
            description: data.description,
            start_date: new Date(data.startDate),
            end_date: new Date(data.endDate),
            owner_id: data.ownerId,
            project_status: 1,
            status: 1,
            created_by: 1,
            modified_by: 1
        });
        const savedProject = await ProjectMasterRepo.save(newProject);

        if (data.userIds && data.userIds.length > 0) {
            const members = data.userIds.map((userId) => ({
                project_id: savedProject.id,
                user_id: userId,
                status: 1
            }));

            await ProjectMemberRepo
                .createQueryBuilder()
                .insert()
                .into(ProjectMember)
                .values(members)
                .execute();
        }
        return { success: true, message: "Project Created Succussful", projectId: savedProject.id, };
    } catch (error) {
        return { success: false, message: 'Internal Server Error' };
    }
}


const getProjectUnassignedUsers = async (project_id: number) => {
    try {
        const users = await UserRepo
            .createQueryBuilder("user")
            .where(qb => {
                const subQueryMembers = qb
                    .subQuery()
                    .select("pm.user_id")
                    .from(ProjectMember, "pm")
                    .where("pm.project_id = :projectId")
                    .getQuery();

                const subQueryOwner = qb
                    .subQuery()
                    .select("pm.owner_id")
                    .from(ProjectMaster, "pm")
                    .where("pm.id = :projectId")
                    .getQuery();

                return `user.id NOT IN ${subQueryMembers} AND user.id != ${subQueryOwner}`
            })
            .setParameter("projectId", project_id)
            .select([
                "user.id",
                "user.full_name",
                "user.email",
                "user.role",
                "user.image",
            ])
            .getMany();

        return { success: true, message: "Data Found", users };
    } catch (error) {
        return { success: false, message: 'Internal Server Error' };
    }
}

const getProjectAvailableUsers = async (project_id: number) => {
    try {
        const users = await UserRepo
            .createQueryBuilder("user")
            .where(qb => {
                const subQueryOwner = qb
                    .subQuery()
                    .select("pm.owner_id")
                    .from(ProjectMaster, "pm")
                    .where("pm.id = :projectId")
                    .getQuery();

                return `user.id != ${subQueryOwner}`
            })
            .setParameter("projectId", project_id)
            .select([
                "user.id",
                "user.full_name",
                "user.email",
                "user.role",
                "user.image",
            ])
            .getMany();

        return { success: true, message: "Data Found", users };
    } catch (error) {
        return { success: false, message: 'Internal Server Error' };
    }
}

// Save Project User
const saveProjectUsers = async (postData: { user_id: number; project_id: number }[]) => {
    try {
        const projectId = postData[0]?.project_id;

        // 1. Delete all existing members for this project
        await ProjectMemberRepo.delete({ project_id: projectId });

        // 2. Insert as the new Project Member
        const result = await ProjectMemberRepo
            .insert(postData);

        return {
            success: true,
            message: 'Project Users saved successfully.',
            inserted: result.identifiers.length,
        };
    } catch (err) {
        return {
            success: false,
            message: 'Something went wrong, project users saved unsuccessful',
        };
    }
}

// Get Project Users
const getProjectAssignedUsers = async (project_id: number) => {
    try {
        const users = await UserRepo
            .createQueryBuilder("user")
            .leftJoin("user.projectMembers", "pm")
            .where('pm.project_id = :projectId', { projectId: project_id })
            .select([
                'user.id',
                'user.full_name',
                'user.email',
                'user.image'
            ])
            .getMany();
        return { success: true, message: "Data Found", users };
    } catch (error) {
        return { success: false, message: 'Internal Server Error' };
    }
}


// Remove All Project Users
const removeAllProjectUsers = async (project_id: number) => {
    try {
        // Delete all existing members for this project
        const result = await ProjectMemberRepo.delete({ project_id: project_id });

        return {
            success: true,
            message: 'All Project Users removed successfully.',
            result
        };
    } catch (err) {
        return {
            success: false,
            message: 'Something went wrong, unable to removed project members',
        };
    }
}

const ProjectModel = {
    getProjects,
    createProject,
    getProjectUnassignedUsers,
    getProjectAvailableUsers,
    saveProjectUsers,
    getProjectAssignedUsers,
    removeAllProjectUsers,
};
export default ProjectModel;