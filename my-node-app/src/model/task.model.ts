import moment from "moment";
// import { TaskMember } from "../entity/taskEntity/TaskMember";
import { PriorityTaskRepo, ProjectMasterRepo, ProjectMemberRepo, ProjectTaskRepo, StatusTaskRepo, TaskMemberRepo, UserRepo } from "../repositories";
import { AddTaskDTO } from "../schemas/addTaskSchema";
import { ProjectTask } from "../entity/projectEntity/ProjectTask";
import { ProjectMember } from "../entity/projectEntity/ProjectMember";
import { TaskMember } from "../entity/taskEntity/TaskMember";

const getAllTaskPriorities = async () => {
    try {
        const priorityTask = await PriorityTaskRepo.find();

        return { success: true, message: "Data Found", priority: priorityTask };
    } catch (error) {
        return { success: false, message: "Internal Server Error" };
    }
};


const getAllTaskStatus = async () => {
    try {
        const statusTask = await StatusTaskRepo.find();

        return { success: true, message: "Data Found", status: statusTask };
    } catch (error) {
        return { success: false, message: "Internal Server Error" };
    }
};


const addUpdateTask = async (data: AddTaskDTO) => {
    try {
        let savedTask;

        if (data.task_id) {
            // Update existing target
            const existingTask = await ProjectTaskRepo.findOneBy({ id: data.task_id });
            if (!existingTask) {
                return { success: false, message: "Task not found" };
            }

            ProjectTaskRepo.merge(existingTask, {
                target_id: data.target_id,
                project_id: Number(data.project_id),
                title: data.title,
                description: data.description,
                status: Number(data.status),
                start_date: new Date(data.startDate),
                due_date: new Date(data.endDate),
                priority: Number(data.priority),
                modified_by: 1,
            });

            savedTask = await ProjectTaskRepo.save(existingTask);

            // Clear old members
            await TaskMemberRepo.delete({ task_id: data.task_id });
        } else {
            // Create new Task
            const newTask = ProjectTaskRepo.create({
                target_id: data.target_id,
                project_id: Number(data.project_id),
                title: data.title,
                description: data.description,
                status: Number(data.status),
                start_date: new Date(data.startDate),
                due_date: new Date(data.endDate),
                priority: Number(data.priority),
                created_by: 1,
                modified_by: 1
            });

            savedTask = await ProjectTaskRepo.save(newTask);
        }
        if (data.userIds && data.userIds.length > 0) {
            const members = data.userIds.map((userId) => ({
                task_id: savedTask.id,
                user_id: userId,
                status: 1
            }));

            await TaskMemberRepo
                .createQueryBuilder()
                .insert()
                .into(TaskMember)
                .values(members)
                .execute();

        }
        return {
            success: true,
            message: data.task_id ? "Task updated successfully" : "Task added successfully",
            taskId: savedTask.id
        };
    } catch (error) {
        console.error("Insert error:", error);
        return { success: false, message: 'Internal Server Error' };
    }
}


const getProjectsTasks = async (project_id: number) => {
    try {
        const rawTasks = await ProjectTaskRepo
            .createQueryBuilder("task")
            .leftJoin("task.priorityInfo", "priority")
            .leftJoin("task.statusInfo", "status")
            .leftJoin("task.members", "member")
            .leftJoin("member.user", "user")
            .where("task.project_id = :projectId", { projectId: project_id })
            .select([
                "task.id AS id",
                "task.project_id AS project_id",
                "task.target_id AS target_id",
                "task.title AS title",
                "task.description AS description",
                "task.start_date AS start_date",
                "task.due_date AS due_date",
                "priority.id AS priority_id",
                "priority.priority_name AS priority_name",
                "status.id AS status_id",
                "status.status_name AS status_name",
                "user.id AS assignee_id",
                "user.full_name AS assignee_name",
                "user.image AS assignee_avatar",
            ])
            .getRawMany();

        // Grouped tasks with assignees
        const groupedByStatusId: Record<number, any[]> = {};

        for (const row of rawTasks) {
            const statusId = row.status_id;
            const taskId = row.id;

            if (!groupedByStatusId[statusId]) {
                groupedByStatusId[statusId] = [];
            }

            // Check if this task is already added
            let existingTask = groupedByStatusId[statusId].find(t => t.id === taskId);

            if (!existingTask) {
                existingTask = {
                    id: row.id,
                    project_id: row.project_id,
                    target_id: row.target_id,
                    title: row.title,
                    description: row.description,
                    start_date: moment(row.start_date).format("DD MMM, YYYY"),
                    due_date: moment(row.due_date).format("DD MMM, YYYY"),
                    priority_id: row.priority_id,
                    priority_name: row.priority_name,
                    status_id: row.status_id,
                    status_name: row.status_name,
                    assignees: [],
                    owner_name: row.owner_name,
                    owner_avatar: row.owner_avatar,
                };
                groupedByStatusId[statusId].push(existingTask);
            }

            // Add assignee if available
            if (row.assignee_id) {
                existingTask.assignees.push({
                    id: row.assignee_id,
                    name: row.assignee_name,
                    avatar: row.assignee_avatar
                });
            }
        }
        return { success: true, message: "Data Found", tasks: groupedByStatusId };
    } catch (error) {
        console.error("Error fetching Project Task:", error);
        return { success: false, message: 'Internal Server Error' };
    }
};


const getTasksUser = async (project_id: number, owner_id: number) => {
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
        console.error("Error fetching task users:", error);
        return { success: false, message: "Internal Server Error" };
    }
};



const TaskModel = {
    getAllTaskPriorities,
    getAllTaskStatus,
    addUpdateTask,
    getProjectsTasks,
    getTasksUser,
};
export default TaskModel;