import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { ProjectMaster } from "./ProjectMaster";
import { MmPriorityTask } from "../taskEntity/TaskPriority";
import { MmStatusTask } from "../taskEntity/TaskStatus";
import { TaskMember } from "../taskEntity/TaskMember";
import { User } from "../userEntity/UserMaster";
import { ProjectTarget } from "./ProjectTarget";

@Entity("project_tasks")
export class ProjectTask {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    target_id?: number;

    @Column()
    project_id!: number;

    @Column({ length: 50 })
    title!: string;

    @Column({ type: 'text' })
    description!: string;

    @Column({ type: 'date' })
    start_date!: Date;

    @Column({ type: 'date' })
    due_date!: Date;

    @Column()
    priority!: number;

    @Column()
    status!: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created!: Date;

    @Column()
    created_by!: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    modified!: Date;

    @Column()
    modified_by!: number;

    @ManyToOne(() => ProjectTarget)
    @JoinColumn({ name: "target_id" })
    target!: ProjectTarget;

    @ManyToOne(() => ProjectMaster)
    @JoinColumn({ name: "project_id" })
    project!: ProjectMaster;

    @ManyToOne(() => MmPriorityTask)
    @JoinColumn({ name: "priority" })
    priorityInfo!: MmPriorityTask;

    @ManyToOne(() => MmStatusTask)
    @JoinColumn({ name: 'status' })
    statusInfo!: MmStatusTask;

    @OneToMany(() => TaskMember, (tm) => tm.task)
    members!: TaskMember[];
}
