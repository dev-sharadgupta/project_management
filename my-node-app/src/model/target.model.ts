import moment from "moment";
import { TargetMember } from "../entity/targetEntity/TargetMember";
import { PriorityTargetRepo, ProjectMasterRepo, ProjectMemberRepo, ProjectTargetRepo, StatusTargetRepo, TargetMemberRepo, UserRepo } from "../repositories";
import { AddTargetDTO } from "../schemas/addTargetSchema";
import { ProjectTarget } from "../entity/projectEntity/ProjectTarget";
import { ProjectMember } from "../entity/projectEntity/ProjectMember";

const getAllTargetPriorities = async () => {
    try {
        const priorityTarget = await PriorityTargetRepo.find();

        return { success: true, message: "Data Found", priority: priorityTarget };
    } catch (error) {
        return { success: false, message: "Internal Server Error" };
    }
};


const getAllTargetStatus = async () => {
    try {
        const statusTarget = await StatusTargetRepo.find();

        return { success: true, message: "Data Found", status: statusTarget };
    } catch (error) {
        return { success: false, message: "Internal Server Error" };
    }
};

const addUpdateTarget = async (data: AddTargetDTO) => {
    try {
        let savedTarget;

        if (data.target_id) {
            // Update existing target
            const existingTarget = await ProjectTargetRepo.findOneBy({ id: data.target_id });
            if (!existingTarget) {
                return { success: false, message: "Target not found" };
            }

            ProjectTargetRepo.merge(existingTarget, {
                title: data.title,
                description: data.description,
                owner_id: Number(data.owner_id),
                project_id: Number(data.project_id),
                status: Number(data.status),
                priority: Number(data.priority),
                start_date: new Date(data.startDate),
                due_date: new Date(data.endDate),
                modified_by: 1,
            });

            savedTarget = await ProjectTargetRepo.save(existingTarget);

            // Clear old members
            await TargetMemberRepo.delete({ target_id: data.target_id });
        } else {
            // Create new target
            const newTarget = ProjectTargetRepo.create({
                title: data.title,
                description: data.description,
                owner_id: Number(data.owner_id),
                project_id: Number(data.project_id),
                status: Number(data.status),
                priority: Number(data.priority),
                start_date: new Date(data.startDate),
                due_date: new Date(data.endDate),
                created_by: 1,
                modified_by: 1
            });

            savedTarget = await ProjectTargetRepo.save(newTarget);
        }
        if (data.userIds && data.userIds.length > 0) {
            const members = data.userIds.map((userId) => ({
                target_id: savedTarget.id,
                user_id: userId,
                status: 1
            }));

            await TargetMemberRepo
                .createQueryBuilder()
                .insert()
                .into(TargetMember)
                .values(members)
                .execute();

        }
        return {
            success: true,
            message: data.target_id ? "Target updated successfully" : "Target added successfully",
            targetId: savedTarget.id
        };
    } catch (error) {
        console.error("Insert error:", error);
        return { success: false, message: 'Internal Server Error' };
    }
}


const getProjectsTargets = async (project_id: number) => {
    try {
        const rawTargets = await ProjectTargetRepo
            .createQueryBuilder("target")
            .leftJoin("target.priorityInfo", "priority")
            .leftJoin("target.statusInfo", "status")
            .leftJoin("target.members", "member")
            .leftJoin("member.user", "user")
            .leftJoin("target.owner", "owner")
            .where("target.project_id = :projectId", { projectId: project_id })
            .select([
                "target.id AS id",
                "target.project_id AS project_id",
                "target.title AS title",
                "target.description AS description",
                "target.start_date AS start_date",
                "target.due_date AS due_date",
                "priority.id AS priority_id",
                "priority.priority_name AS priority_name",
                "status.id AS status_id",
                "status.status_name AS status_name",
                "user.id AS assignee_id",
                "user.full_name AS assignee_name",
                "user.image AS assignee_avatar",
                "owner.id AS owner_id",
                "owner.full_name AS owner_name",
                "owner.image AS owner_avatar"
            ])
            .getRawMany();

        // Grouped targets with assignees
        const groupedByStatusId: Record<number, any[]> = {};

        for (const row of rawTargets) {
            const statusId = row.status_id;
            const targetId = row.id;

            if (!groupedByStatusId[statusId]) {
                groupedByStatusId[statusId] = [];
            }

            // Check if this target is already added
            let existingTarget = groupedByStatusId[statusId].find(t => t.id === targetId);

            if (!existingTarget) {
                existingTarget = {
                    id: row.id,
                    project_id: row.project_id,
                    title: row.title,
                    description: row.description,
                    start_date: moment(row.start_date).format("DD MMM, YYYY"),
                    due_date: moment(row.due_date).format("DD MMM, YYYY"),
                    priority_id: row.priority_id,
                    priority_name: row.priority_name,
                    status_id: row.status_id,
                    status_name: row.status_name,
                    assignees: [],
                    owner_id: row.owner_id,
                    owner_name: row.owner_name,
                    owner_avatar: row.owner_avatar,
                };
                groupedByStatusId[statusId].push(existingTarget);
            }

            // Add assignee if available
            if (row.assignee_id) {
                existingTarget.assignees.push({
                    id: row.assignee_id,
                    name: row.assignee_name,
                    avatar: row.assignee_avatar
                });
            }
        }
        return { success: true, message: "Data Found", targets: groupedByStatusId };
    } catch (error) {
        return { success: false, message: 'Internal Server Error' };
    }
};


const getTargetsUser = async (project_id: number, owner_id: number) => {
    try {
        // 1. Get all user IDs from project_members
        const memberUserIds = await ProjectMemberRepo
            .createQueryBuilder("pm")
            .select("pm.user_id", "user_id")
            .where("pm.project_id = :projectId", { projectId: project_id })
            .getRawMany();

        // 2. Extract user_ids from members
        const userIds: number[] = memberUserIds.map(u => u.user_id);

        // 3. Only add owner_id if it's not already in the list
        if (!userIds.includes(owner_id)) {
            userIds.push(owner_id);
        }

        // 4. Fetch user details
        const users = await UserRepo
            .createQueryBuilder("user")
            .where("user.id IN (:...userIds)", { userIds })
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
        console.error("Error fetching target users:", error);
        return { success: false, message: "Internal Server Error" };
    }
};

const TargetModel = {
    getAllTargetPriorities,
    getAllTargetStatus,
    addUpdateTarget,
    getProjectsTargets,
    getTargetsUser,
};
export default TargetModel;