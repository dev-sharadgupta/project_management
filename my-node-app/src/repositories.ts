import { AppDataSource } from "./data-source";
import { ProjectMaster } from "./entity/projectEntity/ProjectMaster";
import { ProjectMember } from "./entity/projectEntity/ProjectMember";
import { User } from "./entity/userEntity/UserMaster";
import { MmPriorityTarget } from "./entity/targetEntity/TargetPriority";
import { MmStatusTarget } from "./entity/targetEntity/TargetStatus";
import { ProjectTarget } from "./entity/projectEntity/ProjectTarget";
import { TargetMember } from "./entity/targetEntity/TargetMember";
import { ProjectTask } from "./entity/projectEntity/ProjectTask";
import { MmPriorityTask } from "./entity/taskEntity/TaskPriority";
import { MmStatusTask } from "./entity/taskEntity/TaskStatus";
import { TaskMember } from "./entity/taskEntity/TaskMember";
import { MmTagNote } from "./entity/noteEntity/MmTagNote";
import { ProjectNote } from "./entity/projectEntity/ProjectNote";
import { NoteTag } from "./entity/noteEntity/NoteTag";

/* Project */
export const ProjectMasterRepo = AppDataSource.getRepository(ProjectMaster);
export const ProjectMemberRepo = AppDataSource.getRepository(ProjectMember);

/* User */
export const UserRepo = AppDataSource.getRepository(User);

/* Target */
export const PriorityTargetRepo = AppDataSource.getRepository(MmPriorityTarget);
export const StatusTargetRepo = AppDataSource.getRepository(MmStatusTarget);
export const ProjectTargetRepo = AppDataSource.getRepository(ProjectTarget);
export const TargetMemberRepo = AppDataSource.getRepository(TargetMember);

/* Task */
export const PriorityTaskRepo = AppDataSource.getRepository(MmPriorityTask);
export const StatusTaskRepo = AppDataSource.getRepository(MmStatusTask);
export const ProjectTaskRepo = AppDataSource.getRepository(ProjectTask);
export const TaskMemberRepo = AppDataSource.getRepository(TaskMember);


/* Note */
export const MmTagNoteRepo = AppDataSource.getRepository(MmTagNote);
export const ProjectNoteRepo = AppDataSource.getRepository(ProjectNote);
export const NoteTagRepo = AppDataSource.getRepository(NoteTag);
